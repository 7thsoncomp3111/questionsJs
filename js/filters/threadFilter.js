/*global todomvc, angular, Firebase */
'use strict';

/**
* The threadFilter
* Inserts threads properly
*
*/
todomvc.filter('threadFilter', function () {
  return function (input, activeQuestionId) {
      console.log(activeQuestionId);
    var sorted = [];

    angular.forEach(input, function (thread) {
        if(thread.prev == activeQuestionId){
            // Insert head threads
            sorted.push(thread);
            // Insert subthreads
            var subthread = input.$getRecord(thread.next);
            while(subthread != null){
                sorted.push(subthread);
                subthread = input.$getRecord(subthread.next);
            }
        }
    });

    return sorted;
  };
});
