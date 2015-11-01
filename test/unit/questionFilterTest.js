'use strict';

var questionList=[{
  wholeMsg: "newTodo",
  head: "head",
  headLastChar: "?",
  desc: "desc",
  linkedDesc: "linkedDesc",
  completed: false,
  timestamp: 0,
  tags: "...",
  upvote: 3,
  downvote: 3,
  order: 3
},{
  wholeMsg: "newTodo",
  head: "head",
  headLastChar: "?",
  desc: "desc",
  linkedDesc: "linkedDesc",
  completed: false,
  timestamp: 0,
  tags: "...",
  upvote: 2,
  downvote: 2,
  order: 4
},{
  wholeMsg: "newTodo",
  head: "head",
  headLastChar: "?",
  desc: "desc",
  linkedDesc: "linkedDesc",
  completed: false,
  timestamp: 0,
  tags: "...",
  upvote: 2,
  downvote: 2,
  order: 5
},{
  wholeMsg: "newTodo",
  head: "head",
  headLastChar: "?",
  desc: "desc",
  linkedDesc: "linkedDesc",
  completed: false,
  timestamp: 0,
  tags: "...",
  upvote: 2,
  downvote: 2,
  order: 6
},{
  wholeMsg: "newTodo",
  head: "head",
  headLastChar: "?",
  desc: "desc",
  linkedDesc: "linkedDesc",
  completed: false,
  timestamp: new Date().getTime(), //new
  tags: "...",
  upvote: 2,
  downvote: 2,
  order: 0
},{
  wholeMsg: "newTodo",
  head: "head",
  headLastChar: "?",
  desc: "desc",
  linkedDesc: "linkedDesc",
  completed: false,
  timestamp: new Date().getTime()-1, //new
  tags: "...",
  upvote: 0,
  downvote: 0,
  order: 2
},{
  wholeMsg: "newTodo",
  head: "head",
  headLastChar: "?",
  desc: "desc",
  linkedDesc: "linkedDesc",
  completed: false,
  timestamp: new Date().getTime(), // latest
  tags: "...",
  upvote: 0,
  downvote: 0,
  order: 1
//},
}];

describe('TodoCtrl', function() {
  beforeEach(module('todomvc'));

  describe('questionFilter Testing', function() {
    beforeEach(module(function($provide) {
      $provide.value('version', 'TEST_VER'); //TODO: what is this provide?
      console.log("provide.value: " + $provide.value);
    }));

    it('has a question filter', inject(function($filter) {
      expect($filter('questionFilter')).not.toBeNull();
    }));

    it('Filter order test', inject(function(questionFilterFilter) { // need to put Filter suffix
      var filteredList = questionFilterFilter(questionList, 100);
      for (var i in filteredList) {
        expect(""+filteredList[i].order).toEqual(i);
      }
    }));

    it('Filter max test', inject(function(questionFilterFilter) { // need to put Filter suffix
      var filteredList = questionFilterFilter(questionList, 1);
      expect(filteredList.length).toEqual(5);

      for (var i in filteredList) {
        expect(""+filteredList[i].order).toEqual(i);
      }
    }));
  });
});
