/*global todomvc, angular, Firebase */
'use strict';

/**
* The questionFilter
* Show the new questions on the top and show only max questions
*
*/
todomvc.filter('questionFilter', function () {
  return function (input, max) {
    var sorted = [];
    var newQuestions = [];
    var sortedCount = 0;

    angular.forEach(input, function (todo) {
      if (todo.timestamp > new Date().getTime() - 180000) { // 3min
        todo.new = true;
        newQuestions.push(todo);
      } else if (sortedCount++ <= max){  // show top n only.
        todo.new = false;
        sorted.push(todo);
		sortedCount++;
      }
    });
	
    // sorting new questions based on the time if echo is the same.
    // Newer ones are on the top
    newQuestions.sort(function(a, b) {
      if (a.upvote-a.downvote == b.upvote-b.downvote) {
        return b.timestamp - a.timestamp;
      }
      return (b.upvote-b.downvote) - (a.upvote-a.downvote);
    });
	
    sorted.sort(function(a, b) {
      if (a.upvote-a.downvote == b.upvote-b.downvote) {
        return b.timestamp - a.timestamp;
      }
      return (b.upvote-b.downvote) - (a.upvote-a.downvote);
    });

    // Combined list
    return newQuestions.concat(sorted);
  };
});
