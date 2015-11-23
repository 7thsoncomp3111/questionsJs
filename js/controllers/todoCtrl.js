/*global todomvc, angular, Firebase */
'use strict';

/**
* The main controller for the app. The controller:
* - retrieves and persists the model via the $firebaseArray service
* - exposes the model to the template and provides event handlers
*/
todomvc.controller('TodoCtrl',
['$scope', '$location', '$firebaseArray', '$sce', '$localStorage', '$window', '$compile', '$filter', '$uibModal','Upload', '$timeout',
function ($scope, $location, $firebaseArray, $sce, $localStorage, $window, $compile, $filter, $uibModal, Upload, $timeout) {

	// set local storage
	$scope.$storage = $localStorage;

	var scrollCountDelta = 10;

	// show all questions for now
	$scope.maxQuestion = 1000;//scrollCountDelta;

	/*
	$(window).scroll(function(){
	if($(window).scrollTop() > 0) {
	$("#btn_top").show();
} else {
$("#btn_top").hide();
}
});
*/
var splits = $location.path().trim().split("/");
var roomId = angular.lowercase(splits[1]);
if (!roomId || roomId.length === 0) {
	roomId = "all";
}
$scope.roomId = roomId;

$scope.copyRoomUrl = function() {
	prompt('Copy the room URL:', $location.absUrl());
}

var firebaseURL = "https://resplendent-inferno-9346.firebaseio.com";
//Get questions
var url_todos = firebaseURL + '/room/' + roomId + "/questions/";
var echoRef = new Firebase(url_todos);
var query = echoRef.orderByChild("order");
$scope.todos = $firebaseArray(query);

// Get threads
var url_threads = firebaseURL + '/room/' + roomId + "/threads/";
echoRef = new Firebase(url_threads);
query = echoRef.orderByKey();
$scope.threads = $firebaseArray(query);

// Get threads
var url_subscription = firebaseURL + "/subscription/";
echoRef = new Firebase(url_subscription);
query = echoRef.orderByKey();
$scope.subscriptions = $firebaseArray(query);

$scope.input = {};
$scope.textSearch = false;

// pre-precessing for collection
$scope.$watchCollection('todos', function () {

	var total = 0;
	var rankedTags = {};

	$scope.todos.forEach(function (todo) {

		// Skip invalid entries so they don't break the entire app.
		if (!todo || !todo.head ) {
			return;
		}

		total++;

		// set upvote/downvote percentage
		var votes = todo.upvote + todo.downvote;
		todo.upvotePercent = votes == 0 ? 0 : todo.upvote / votes * 100;
		todo.downvotePercent = votes == 0 ? 0 : todo.downvote/ votes * 100;

		// set tags
		var matches = todo.wholeMsg.match(/#([\w\-]+)/g);
		if (matches != null && matches.length > 0) {
			matches = _.unique(matches);
			matches.forEach(function(match, i) {
				matches[i] = match.substring(1); // remove hashtag
				rankedTags[matches[i]] = (rankedTags[matches[i]] || 0) + 1;
			});
			todo.tags = matches.sort();
		} else {
			todo.tags = [];
		}

		// initialize activity & threadNum
		if(todo.activity == null){
			todo.activity = 0;
		}
		if(todo.threadNum == null){
			todo.threadNum = 0;
		}
	});

	//map tag names and freq to verbose
	rankedTags = _.map(rankedTags, function(count, title) {
		return { title: title, count: count };
	});

	$scope.rankedTags = rankedTags;
	$scope.totalCount = total;

}, true);

$scope.$watchCollection('threads', function () {
	function getNumOfThreads(qindex){
		function matchNum(target){
			var counter = 0;
			$scope.threads.forEach(function(thread){
				if(thread.prev == target){
					counter++;
					counter+=matchNum(thread.$id);
				}
			});
			return counter;
		}
		return matchNum(qindex);
	}
	$scope.todos.forEach(function (todo) {
		//set threadnum
		todo.threadNum = getNumOfThreads(todo.$id);
		//console.log(todo.threadNum);
		todo.activity = todo.views*0.5+(todo.upvote+todo.downvote)*1.5+todo.threadNum*2;
		$scope.todos.$save(todo);
	});
}, true);

// Get the first sentence and rest
$scope.getFirstAndRestSentence = function($string) {

	var head = $string;
	var desc = "";

	var separators = [". ", "? ", "! ", '\n'];

	var firstIndex = -1;
	for (var i in separators) {
		var index = $string.indexOf(separators[i]);
		if (index == -1) continue;
		if (firstIndex == -1) {firstIndex = index; continue;}
		if (firstIndex > index) {firstIndex = index;}
	}

	if (firstIndex !=-1) {
		head = $string.slice(0, firstIndex+1);
		desc = $string.slice(firstIndex+1);
	}
	return [head, desc];
};

$scope.checkImageExist = function(todo){

	if(todo.image == null){
		return false;
	} else {
		return true;
	}

}

$scope.addTodo2 = function(todo){
	var imageLink = "https://s3-ap-southeast-1.amazonaws.com/comp3111images/" + fileNameforUpload;
	todo.image = imageLink;
	$scope.todos.$add(todo);
}

$scope.addTodo = function (file) {

	var newTodo = $scope.input.messagetext.trim();
	newTodo = $filter('colonToCode')(newTodo);

	// No input, so just do nothing
	if (!newTodo.length) {
		return;
	}

	var firstAndLast = $scope.getFirstAndRestSentence(newTodo);
	var head = firstAndLast[0];
	var desc = firstAndLast[1];

	var newtodo = {
		wholeMsg: newTodo,
		head: head,
		headLastChar: head.slice(-1),
		desc: desc,
		linkedDesc: Autolinker.link(desc, {newWindow: false, stripPrefix: false}),
		completed: false,
		pinned: false,
		timestamp: new Date().getTime(),
		tags: "...",
		upvote: 0,
		downvote: 0,
		views: 0,
		order: 0
	};

	if(file!=null){
		$scope.upload1(file,newtodo);
	}
	else{
		$scope.todos.$add(newtodo);
	}

	// remove the posted question in the input
	$(".q-input").empty();
	$scope.input = {};
};

$scope.addUpvote = function (todo) {

	if ($scope.$storage[todo.$id]||todo.completed) return;

	todo.upvote++;
	// Hack to order using this order.
	todo.order = todo.order -1;
	$scope.todos.$save(todo);

	// Disable the button
	$scope.$storage[todo.$id] = true;
};

$scope.addDownvote = function (todo) {

	if ($scope.$storage[todo.$id]||todo.completed) return;

	todo.downvote++;
	// Hack to order using this order.
	todo.order = todo.order -1;
	$scope.todos.$save(todo);

	// Disable the button
	$scope.$storage[todo.$id] = true;
};

$scope.addViews = function(todo){
	// Check if Locked
	if(!todo.completed){
		todo.views++;
		todo.activity = todo.views*0.5+(todo.upvote+todo.downvote)*1.5+todo.threadNum*2;
		// Hack to order using this order.
		todo.order = todo.order -1;
		$scope.todos.$save(todo);
	}
}

$scope.lockPost = function(todo){
	todo.completed = !todo.completed;
	// Hack to order using this order.
	todo.order = todo.order -1;
	$scope.todos.$save(todo);
}

$scope.pinPost = function(todo){
	todo.pinned = !todo.pinned;
	// Hack to order using this order.
	todo.order = todo.order -1;
	$scope.todos.$save(todo);
}

// Set default order to ''-activity'
$scope.orderpref='-activity';
$scope.setOrderpref = function (pref){
	$scope.orderpref = pref;
}

//Append tag to tag search box
$scope.tagsearch = false;
$scope.tagsearchitems = [];
$scope.clickTag = function(t){
	if($scope.tagsearchitems.indexOf(t)==-1){
		$scope.tagsearch = true;
		$scope.tagsearchitems.push(t);
	}
}

//Clear all tags in tag search box
$scope.clearTag = function(t_index){
	if(t_index == null){
		$scope.tagsearch = false;
		$scope.tagsearchitems = [];
	}
	else{
		$scope.tagsearchitems.splice(t_index,1);
		if(!$scope.tagsearchitems.length){
			$scope.tagsearch = false;
		}
	}
}

$scope.removeTodo = function (todo) {
	$scope.todos.$remove(todo);
};

$scope.FBLogin = function () {
	var ref = new Firebase(firebaseURL);
	ref.authWithOAuthPopup("facebook", function(error, authData) {
		if (error) {
			console.log("Login Failed!", error);
		} else {
			$scope.$apply(function() {
				$scope.$authData = authData;
				$scope.isAdmin = true;
			});
			console.log("Authenticated successfully with payload:", authData);
		}
	});
};

$scope.FBLogout = function () {
	var ref = new Firebase(firebaseURL);
	ref.unauth();
	delete $scope.$authData;
	$scope.isAdmin = false;
};

var isUploadValue = false;
var fileNameforUpload = "";

$scope.upload1 = function (file,todo) {
	isUploadValue = true ;
	$scope.checkValidKeyName(file.name,file,todo);

};

$scope.upload2 = function(file,todo) {
    Upload.upload({
        url: 'http://comp3111images.s3.amazonaws.com/',
        method:'POST',
        data: {
        	key: fileNameforUpload,
	        AWSAccessKeyId: 'AKIAIZEFM6CFYRMWAWTQ',
	        acl: 'public-read',
	        policy:"ewogICJleHBpcmF0aW9uIjogIjIwMTUtMTItMTJUMDA6MDA6MDBaIiwKICAiY29uZGl0aW9ucyI6IFsKICAgIHsiYnVja2V0IjogImNvbXAzMTExaW1hZ2VzIn0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRrZXkiLCAiIl0sCiAgICB7ImFjbCI6ICJwdWJsaWMtcmVhZCJ9LAogICAgWyJzdGFydHMtd2l0aCIsICIkQ29udGVudC1UeXBlIiwgIiJdLAogICAgWyJzdGFydHMtd2l0aCIsICIkZmlsZW5hbWUiLCAiIl0sCiAgICBbImNvbnRlbnQtbGVuZ3RoLXJhbmdlIiwgMCwgNTI0Mjg4MDAwXQogIF0KfQ==",
	        signature:"ev/fTZ0MnlaGnv+YL5hPRw+gkdE=",
	        "Content-Type": file.type != '' ? file.type : 'image/*', // content type of the file (NotEmpty)
	        filename: file.name, // this is needed for Flash polyfill IE8-9
	        file: file
        },
    }).then(function (response) {
        $timeout(function () {
        $scope.result = response.data;
        console.log('Success ' + response.config.data.file.name + 'uploaded. Response: ' + response.data);
        $scope.addTodo2(todo);
        $scope.picFile = null;
        isUploadValue = false;
      	});
    }, function (response) {
       if (response.status > 0)
       		$scope.errorMsg = response.status + ': ' + response.data;
       	 	console.log('Error status: ' + response.status);
    }, function (evt) {
            $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + $scope.progress + '% ' + evt.config.data.file.name);
    });
}

$scope.checkValidKeyName = function (name,file,todo) {
	AWS.config.update({
	    accessKeyId: "AKIAIZEFM6CFYRMWAWTQ",
	    secretAccessKey: "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",
	});

	var s3 = new AWS.S3();
	var params = {
		Bucket: 'comp3111images',
		Key: name
	};

	fileNameforUpload = name;
	s3.getObject(params, function(err, data) {
  		if (err) {
     		$scope.upload2(file,todo);
		} else {
			var newName = "1-" + name;
    		$scope.checkValidKeyName(newName,file,todo);
  		}
	});
}

$scope.increaseMax = function () {
	if ($scope.maxQuestion < $scope.totalCount) {
		$scope.maxQuestion += scrollCountDelta;
	}
};

$scope.toTop = function toTop() {
	$window.scrollTo(0,0);
};

// Not sure what is this code. Todel
if ($location.path() === '') {
	$location.path('/');
}
$scope.location = $location;

// autoscroll
angular.element($window).bind("scroll", function() {
	if ($window.innerHeight + $window.scrollY >= $window.document.body.offsetHeight) {

		// update the max value
		$scope.increaseMax();

		// force to update the view (html)
		$scope.$apply();
	}
});

// UI Modal
// resolve: pass variables to threadCtrl
$scope.open = function (qindex) {
	var modalInstance = $uibModal.open({
	  animation: true,
	  templateUrl: 'threadModal.html',
	  controller: 'ThreadCtrl',
	  size: '',
	  resolve: {
        questions: function () {
          return $scope.todos;
	  	},
		qindex: function(){
			return qindex
		},
		threads: function(){
			return $scope.threads;
		}
      }
	});
};

$scope.toggleAnimation = function () {
	$scope.animationsEnabled = !$scope.animationsEnabled;
};

function checkExistSubscription(e,q){
	var exist = false;
	$scope.subscriptions.forEach(function(subscription){
		if(subscription.email == e && subscription.id == q){
			exist = true;
		}
	});
	return exist;
}

$scope.getNumSubscription = function(q){
	var counter = 0;
	$scope.subscriptions.forEach(function(subscription){
		if(subscription.id == q){
			counter++;
		}
	});
	return counter;
}

$scope.subscribeAction = function(qid){
	var email = prompt("Please enter your email to [subscribe]", "@ust.hk");
    if (email != null) {
		if(!checkExistSubscription(email,qid)){
			// Add email to Firebase
			var newsubscription = {
				email: email,
				id: qid
			}
			$scope.subscriptions.$add(newsubscription);
			$scope.subscriptions.$save(newsubscription);
			alert("You have successfully subscribed to this question.");
		}
		else{
			alert("You have already subscribed this question with the same email. Please try again.");
		}
    }
}

$scope.unsubscribeAction = function(qid){
	var email = prompt("Please enter your email to [unsubscribe]","");
	if(email != null){
		if(checkExistSubscription(email,qid)){
			// Remove email from Firebase
			$scope.subscriptions.forEach(function(subscription){
				if(subscription.email == email && subscription.id == qid){
					$scope.subscriptions.$remove(subscription);
				}
			});
			alert("You have successfully unsubscribed from this question.");
		}
		else{
			alert("Invalid subscribed email. Please first subscribe to this question with your email.");
		}
	}
}

}]);
