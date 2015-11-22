/*global todomvc, angular, Firebase */
'use strict';

/**
* The threadFilter
* Inserts threads in bottom-sibling-up order.
*
* First start with init-leaves (sorted from latest to oldest, see Sorting Rule), find their respective children nodes.
* For each children, move up one node and find its siblings (see Sibling Rule), until reaching root.
* Siblings are sorted by timestamp (oldest to latest) and are also leaves, so that precedence of [sibling>ini-leaves] is maintained.
*
*
* Sibling Rule
* 1. Is a leaf
* 2. Same immediate parent
* 3. Not included before
*
* Sorting Rule
* Thread with latest subthread gets promoted
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
            var bufferSib = [];
            bufferSib.push(buffer.pop()); // Needed for comparison
            angular.forEach(input, function(thread){
                if(isLeaf(thread) && thread.prev == start.prev && thread != start && buffer.indexOf(thread)==-1){
                    bufferSib.push(thread);
                }
            });
            // Sort siblings by timestamp
            if(bufferSib.length>1 && bufferSib[bufferSib.length-1].prev==start.$id){
                bufferSib.sort(function(a,b){
                    return a.timestamp < b.timestamp;
                });
            }
            return buffer.concat(bufferSib);
        }

        function getChildren(sorted, buffer, start){
            // Condition: Reached root, i.e. start.prev=null && start.$id=activeQUestion
            // Operation: Start pushing buffer to sorted
            if(start == null){
                // Condition: root does not match activeQuestion
                // Operation: Dump buffer
                if(buffer[buffer.length-1].prev != activeQuestionId){
                    return sorted;
                }
                buffer = buffer.reverse();
                buffer.forEach(function(b){
                    // Prevent duplicates
                    if(sorted.indexOf(b)==-1){
                        sorted.push(b);
                    }
                });
                return sorted;
            }
            // Prevent many-to-one duplications
            if(buffer.indexOf(start)==-1){
                buffer.push(start);
                buffer = getSiblings(sorted, buffer, start);
            }
            return getChildren(sorted, buffer, input.$getRecord(start.prev));
        }

        function sortThreads(){
            // reverse(): Show latest leaves first
            var leaves = returnLeaves().reverse();
            var sorted = [];
            angular.forEach(leaves, function(leaf){
                // Prevent additional loops
                if(sorted.indexOf(leaf)==-1){
                    sorted = getChildren(sorted, [], leaf);
                }
            });
            return sorted;
        }
        if(!input || input.length == 0){return;}
        return sortThreads();
    };
});
