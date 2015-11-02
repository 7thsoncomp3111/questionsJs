/*global todomvc, angular, Firebase */
'use strict';

/**
* The tagFilter
* Show only questions that match the specified tag(s)
*
*/
todomvc.filter('tagFilter', function () {
  return function (input, tagsearchitems) {
    var taggedQuestions = [];
    var taggedCount = 0;

    //Empty tagsearchitems
    if(tagsearchitems.length == 0){
        return input;
    }

    angular.forEach(input, function (todo) {
        if(todo.tags != null){
            var result = 0;
            for(var i=0; i<tagsearchitems.length; i++){
              if (todo.tags.indexOf(tagsearchitems[i])!=-1) { // match tags
                result++;
              }
            }
            if(result == tagsearchitems.length){
                taggedQuestions.push(todo);
            }
        }
    });
	
    // sorting tagged questions based on the time if echo is the same.
    // Newer ones are on the top
    taggedQuestions.sort(function(a, b) {
      if (a.upvote-a.downvote == b.upvote-b.downvote) {
        return b.timestamp - a.timestamp;
      }
      return (b.upvote-b.downvote) - (a.upvote-a.downvote);
    });

    // Combined list
    return taggedQuestions;
  };
});
