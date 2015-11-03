/*global todomvc, angular, Firebase */
'use strict';

/**
* The main controller for the app. The controller:
* - retrieves and persists the model via the $firebaseArray service
* - exposes the model to the template and provides event handlers
*/
todomvc.controller('TodoCtrl',
['$scope', '$location', '$firebaseArray', '$sce', '$localStorage', '$window','$compile', '$filter',
function ($scope, $location, $firebaseArray, $sce, $localStorage, $window, $compile, $filter) {

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

// TODO: Please change this URL for your app
var firebaseURL = "https://resplendent-inferno-9346.firebaseio.com/room/";

$scope.roomId = roomId;

var url = firebaseURL + roomId + "/questions/";
var echoRef = new Firebase(url);

var query = echoRef.orderByChild("order");
// Should we limit?
//.limitToFirst(1000);
$scope.todos = $firebaseArray(query);

$scope.input = {};

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
	});

	rankedTags = _.map(rankedTags, function(count, title) {
		return { title: title, count: count };
	});

	$scope.rankedTags = rankedTags;
	$scope.totalCount = total;

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

	var newTodo = $scope.input.messagetext.trim();
	newTodo = $filter('colonToCode')(newTodo);

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
	$(".q-input").empty();
	$scope.input = {};
};

$scope.addUpvote = function (todo) {

	if ($scope.$storage[todo.$id]) return;

	todo.upvote++;
	// Hack to order using this order.
	todo.order = todo.order -1;
	$scope.todos.$save(todo);

	// Disable the button
	$scope.$storage[todo.$id] = true;
};

$scope.addDownvote = function (todo) {

	if ($scope.$storage[todo.$id]) return;

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

}]);
