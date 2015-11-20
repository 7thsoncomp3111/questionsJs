/*global todomvc, angular, Firebase */
'use strict';

/**
* The main controller for the app. The controller:
* - retrieves and persists the model via the $firebaseArray service
* - exposes the model to the template and provides event handlers
*/
todomvc.controller('ThreadCtrl',
['$scope', '$location', '$firebaseArray', '$sce', '$localStorage', '$window','$compile', '$filter', '$uibModalInstance', 'questions', 'qindex',
function ($scope, $location, $firebaseArray, $sce, $localStorage, $window, $compile, $filter, $uibModalInstance, questions, qindex) {
    var splits = $location.path().trim().split("/");
    var roomId = angular.lowercase(splits[1]);
    if (!roomId || roomId.length === 0) {
    	roomId = "all";
    }

    var firebaseURL = "https://resplendent-inferno-9346.firebaseio.com/room/";
    var url = firebaseURL + roomId + "/threads/";
    var echoRef = new Firebase(url);

    var query = echoRef.orderByChild("order");
    // Should we limit?
    //.limitToFirst(1000);
    $scope.threads = $firebaseArray(query);

    // Identify active question
    questions.forEach(function(q){
        if(q.$id == qindex){
            $scope.todo = q;
        }
    });

    // pre-precessing for collection
    $scope.$watchCollection('threads', function () {
        // Utility function to get node
        function returnNode(key){
            for(var i=0; i<$scope.threads.length; i++){
                if(key == $scope.threads[i].$id){
                    return $scope.threads[i];
                }
            }
        }
        function setThreadLevel(tail, level){
            if(!tail || $scope.todo.$id == tail){
                return level-1;
            }
            var prev = returnNode(tail.prev);
            return setThreadLevel(prev, level+1);
        }
        function addNext(key){
            var nexts = [];
            for(var i=0; i<$scope.threads.length; i++){
                if(key == $scope.threads[i].prev){
                    nexts.push($scope.threads[i].$id);
                }
            }
            return nexts;
        }
        var total = 0;
    	$scope.threads.forEach(function (thread) {
    		// Skip invalid entries so they don't break the entire app.
    		if (!thread) {
    			return;
    		}
    		total++;

    		// set upvote/downvote percentage
    		var votes = thread.upvote + thread.downvote;
    		thread.upvotePercent = votes == 0 ? 0 : thread.upvote / votes * 100;
    		thread.downvotePercent = votes == 0 ? 0 : thread.downvote/ votes * 100;
    	});

        // set level
        $scope.threads.forEach(function(thread){
            thread.level = setThreadLevel(thread, 0);
        });
    	$scope.totalCount = total;
    }, true);

    $scope.addThread = function (activeThread, idx) {
        if(activeThread){
            var newThread = $scope.replyMessageNested[idx].trim();
            var activeQuestion = activeThread;
        }
        else{
            var activeQuestion = $scope.todo.$id;
            var newThread = $scope.replyMessage.trim();
        }
    	newThread = $filter('colonToCode')(newThread);

    	// No input, so just do nothing
    	if (!newThread.length) {
    		return;
    	}

    	$scope.threads.$add({
    		content: Autolinker.link(newThread, {newWindow: false, stripPrefix: false}),
    		completed: false,
    		timestamp: new Date().getTime(),
    		upvote: 0,
    		downvote: 0,
            author: 'anonymous',
            prev: activeQuestion
    	});

    	// remove the posted reply in the input
    	$(".r-input").empty();
    	$scope.replyMessage = "";
        $scope.replyMessageNested = [];
    };

    $scope.removeThread = function (thread) {
    	$scope.threads.$remove(thread);
    };

    $scope.removeAllThreads = function(){
        $scope.threads.forEach(function (thread) {
            $scope.threads.$remove(thread);
        });
    };

    // UI Modal Instance
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);
