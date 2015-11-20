/*global todomvc, angular, Firebase */
'use strict';

/**
* The threadFilter
* Inserts threads properly
*
*/
todomvc.filter('threadFilter', function () {
    return function (input, activeQuestionId) {
        // isLeaf: no prev pointing to it
        function isLeaf(node){
            var result = 1;
            angular.forEach(input, function(thread){
                if(thread.prev == node.$id){
                    result = 0;
                }
            });
            return result;
        }

        function returnLeaves(){
            var leaves = [];
            angular.forEach(input, function(thread){
                if(isLeaf(thread)){
                    leaves.push(thread);
                }
            });
            return leaves;
        }

        function getSiblings(sorted, start){
            angular.forEach(input, function(thread){
                if(isLeaf(thread) && thread.prev == start.prev && sorted.indexOf(thread)==-1){
                    console.log(thread);
                    sorted.push(thread);
                }
            });
            return sorted;
        }

        function getChildren(sorted, start, end){
            if(start == null){
                return sorted;
            }
            // Prevent many-to-one
            if(sorted.indexOf(start)==-1){
                sorted.push(start);
                sorted = getSiblings(sorted, start);
            }
            return getChildren(sorted, input.$getRecord(start.prev), end);
        }

        function sortThreads(activeQuestionId){
            var leaves = returnLeaves();
            var sorted = [];
            angular.forEach(leaves, function(leaf){
                sorted = getChildren(sorted, leaf, activeQuestionId);
            });
            return sorted.reverse();
        }
        if(!input || input.length == 0){return;}
        return sortThreads(activeQuestionId);
    };
});
