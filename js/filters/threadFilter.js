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

        function getSiblings(sorted, buffer, start){
            angular.forEach(input, function(thread){
                if(isLeaf(thread) && thread.prev == start.prev && thread != start && buffer.indexOf(thread)==-1){
                    buffer.push(thread);
                }
            });
            return buffer;
        }

        function getChildren(sorted, buffer, start, end){
            if(start == null){
                return sorted.concat(buffer.reverse());
            }
            // Prevent many-to-one
            if(buffer.indexOf(start)==-1){
                buffer.push(start);
                buffer = getSiblings(sorted, buffer, start);
            }
            return getChildren(sorted, buffer, input.$getRecord(start.prev), end);
        }

        function sortThreads(activeQuestionId){
            var leaves = returnLeaves();
            var sorted = [];
            angular.forEach(leaves, function(leaf){
                if(sorted.indexOf(leaf)==-1){
                    sorted = getChildren(sorted, [], leaf, activeQuestionId);
                }
            });
            return sorted;
        }
        if(!input || input.length == 0){return;}
        return sortThreads(activeQuestionId);
    };
});
