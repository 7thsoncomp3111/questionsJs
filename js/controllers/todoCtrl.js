/*global todomvc, angular, Firebase */
'use strict';

/**
* The main controller for the app. The controller:
* - retrieves and persists the model via the $firebaseArray service
* - exposes the model to the template and provides event handlers
*/
todomvc.controller('TodoCtrl',
['$scope', '$location', '$firebaseArray', '$sce', '$localStorage', '$window','$compile',
function ($scope, $location, $firebaseArray, $sce, $localStorage, $window, $compile) {
	// set local storage
	$scope.$storage = $localStorage;

	var scrollCountDelta = 10;
	$scope.maxQuestion = scrollCountDelta;

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

// TODO: Please change this URL for your app
var firebaseURL = "https://resplendent-inferno-9346.firebaseio.com/room/";


$scope.roomId = roomId;
var url = firebaseURL + roomId + "/questions/";
var echoRef = new Firebase(url);

var query = echoRef.orderByChild("order");
// Should we limit?
//.limitToFirst(1000);
$scope.todos = $firebaseArray(query);


//$scope.input.wholeMsg = '';
$scope.editedTodo = null;

// pre-precessing for collection
$scope.$watchCollection('todos', function () {
	var total = 0;
	var remaining = 0;
	var alltags = Array();
	$scope.todos.forEach(function (todo) {
		// Skip invalid entries so they don't break the entire app.
		if (!todo || !todo.head ) {
			return;
		}

		total++;
		if (todo.completed === false) {
			remaining++;
		}
		//set rating
		todo.rating = todo.upvote-todo.downvote;
		// set upvote/downvote percentage
		todo.upvotePercent = todo.upvote/(todo.upvote+todo.downvote)*100;
		todo.downvotePercent = todo.downvote/(todo.upvote+todo.downvote)*100;
		// set time
		todo.dateString = new Date(todo.timestamp).toString();
		// set tags
		function onlyUnique(value, index, self) {
			return self.indexOf(value) === index;
		}

		var tagmatches = todo.wholeMsg.match(/#[\w\d\-\'\&]+/g);
		if(tagmatches!=null){
			//Filter duplicate matches
			var uniquetags = tagmatches.filter( onlyUnique );
			uniquetags.forEach(function(elem, i, A){
				//Remove hash
				A[i]=elem.replace("#","");
				alltags.push(A[i]);
			});
			//Sort alphabetically
			tagmatches = uniquetags.sort();
		}
		todo.tags = tagmatches;

		todo.trustedDesc = $sce.trustAsHtml(todo.linkedDesc);
		// break into tokens,
		// for replace tag string with tag link by directive replaceTagLinks
		var trustedDescTokens = String(todo.trustedDesc).split(/(#[\w\d\-\'\&]+)/g);
		trustedDescTokens.forEach(function(elem, i, A){
			A[i] = {title: elem.replace("#",""), hasTag: elem.match(/#/g)!=null};
		})
		todo.trustedDescTokens = trustedDescTokens;
	});
	//Get tagcount
	var counts = {};
	var ranknum = 0;
	for(var i=0; i<alltags.length; i++) {
	    var num = alltags[i];
		if(counts[num]){
			counts[num] +=1;
			ranknum++;
		}
		else{
			counts[num]=1;
		}
	}
	//Convert object to array
	var rankedTags = $.map(counts, function(value, index) {
    	return [{title: index, count: value}];
	});
	$scope.rankedTags = rankedTags;
	$scope.totalCount = total;
	$scope.remainingCount = remaining;
	$scope.completedCount = total - remaining;
	$scope.allChecked = remaining === 0;
	$scope.absurl = $location.absUrl();
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

$scope.addTodo = function () {
	var newTodo = $scope.input.wholeMsg.trim();

	// No input, so just do nothing
	if (!newTodo.length) {
		return;
	}

	var firstAndLast = $scope.getFirstAndRestSentence(newTodo);
	var head = firstAndLast[0];
	var desc = firstAndLast[1];

	$scope.todos.$add({
		wholeMsg: newTodo,
		head: head,
		headLastChar: head.slice(-1),
		desc: desc,
		linkedDesc: Autolinker.link(desc, {newWindow: false, stripPrefix: false}),
		completed: false,
		timestamp: new Date().getTime(),
		tags: "...",
		upvote: 0,
		downvote: 0,
		order: 0
	});
	// remove the posted question in the input
	//$scope.input.wholeMsg = ''; //depreciated, but keep to see if plugin is tidy up
	$(".q-input").empty();
};

$scope.editTodo = function (todo) {
	$scope.editedTodo = todo;
	$scope.originalTodo = angular.extend({}, $scope.editedTodo);
};

$scope.addUpvote = function (todo) {

	if ($scope.$storage[todo.$id]) return;

	$scope.editedTodo = todo;
	todo.upvote++;
	// Hack to order using this order.
	todo.order = todo.order -1;
	$scope.todos.$save(todo);

	// Disable the button
	$scope.$storage[todo.$id] = true;
};

$scope.addDownvote = function (todo) {

	if ($scope.$storage[todo.$id]) return;

	$scope.editedTodo = todo;
	todo.downvote++;
	// Hack to order using this order.
	todo.order = todo.order -1;
	$scope.todos.$save(todo);

	// Disable the button
	$scope.$storage[todo.$id] = true;
};

//$scope.orderpref = '-timestamp';
$scope.setOrderpref = function (pref){
	$scope.orderpref = pref;
}

//Append tag to tag search box
$scope.tagsearch = false;
$scope.tagsearchitems = Array();
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
		if($scope.tagsearchitems[0] == null){
			$scope.tagsearch = false;
		}
	}
}

$scope.doneEditing = function (todo) {
	$scope.editedTodo = null;
	var wholeMsg = todo.wholeMsg.trim();
	if (wholeMsg) {
		$scope.todos.$save(todo);
	} else {
		$scope.removeTodo(todo);
	}
};

$scope.revertEditing = function (todo) {
	todo.wholeMsg = $scope.originalTodo.wholeMsg;
	$scope.doneEditing(todo);
};

$scope.removeTodo = function (todo) {
	$scope.todos.$remove(todo);
};

$scope.clearCompletedTodos = function () {
	$scope.todos.forEach(function (todo) {
		if (todo.completed) {
			$scope.removeTodo(todo);
		}
	});
};

$scope.toggleCompleted = function (todo) {
	todo.completed = !todo.completed;
	$scope.todos.$save(todo);
};

$scope.markAll = function (allCompleted) {
	$scope.todos.forEach(function (todo) {
		todo.completed = allCompleted;
		$scope.todos.$save(todo);
	});
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

$scope.increaseMax = function () {
	if ($scope.maxQuestion < $scope.totalCount) {
		$scope.maxQuestion+=scrollCountDelta;
	}
};

$scope.toTop =function toTop() {
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
		console.log('Hit the bottom2. innerHeight' +
		$window.innerHeight + "scrollY" +
		$window.scrollY + "offsetHeight" + $window.document.body.offsetHeight);

		// update the max value
		$scope.increaseMax();

		// force to update the view (html)
		$scope.$apply();
	}
});

}]);
