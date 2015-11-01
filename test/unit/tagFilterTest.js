'use strict';

var tagList=[{
  wholeMsg: "newTodo",
  head: "head",
  headLastChar: "?",
  desc: "desc",
  linkedDesc: "linkedDesc",
  completed: false,
  timestamp: 0,
  tags: "aaa",
  upvote: 0,
  downvote: 0,
  order: 1
},{
  wholeMsg: "newTodo",
  head: "head",
  headLastChar: "?",
  desc: "desc",
  linkedDesc: "linkedDesc",
  completed: false,
  timestamp: 0,
  tags: "bbb",
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
  timestamp: 0,
  tags: "ccc",
  upvote: 0,
  downvote: 0,
  order: 3
},{
  wholeMsg: "newTodo",
  head: "head",
  headLastChar: "?",
  desc: "desc",
  linkedDesc: "linkedDesc",
  completed: false,
  timestamp: 0,
  tags: "ddd",
  upvote: 0,
  downvote: 0,
  order: 4
},{
  wholeMsg: "newTodo",
  head: "head",
  headLastChar: "?",
  desc: "desc",
  linkedDesc: "linkedDesc",
  completed: false,
  timestamp: new Date().getTime(), //new
  tags: "eee",
  upvote: 0,
  downvote: 0,
  order: 5
},{
  wholeMsg: "newTodo",
  head: "head",
  headLastChar: "?",
  desc: "desc",
  linkedDesc: "linkedDesc",
  completed: false,
  timestamp: new Date().getTime()-1, //new
  tags: "fff",
  upvote: 3,
  downvote: 2,
  order: 6
},{
  wholeMsg: "newTodo",
  head: "head",
  headLastChar: "?",
  desc: "desc",
  linkedDesc: "linkedDesc",
  completed: false,
  timestamp: new Date().getTime(), // latest
  tags: "ggg",
  upvote: 0,
  downvote: 0,
  order: 7
//},
}];

describe('TodoCtrl', function() {
  beforeEach(module('todomvc'));

  describe('tagFilter Testing', function() {
    beforeEach(module(function($provide) {
      $provide.value('version', 'TEST_VER'); //TODO: what is this provide?
      console.log("provide.value: " + $provide.value);
    }));

    it('has a tag filter', inject(function($filter) {
      expect($filter('tagFilter')).not.toBeNull();
    }));

    it('Filter order test', inject(function(tagFilterFilter) { // need to put Filter suffix
      var filteredList = tagFilterFilter(tagList, 100);
      for (var i in filteredList) {
        expect(""+filteredList[i].order).toEqual(i);
      }
    }));

    it('Filter max test', inject(function(tagFilterFilter) { // need to put Filter suffix
      var filteredList = tagFilterFilter(tagList, 1);
      expect(filteredList.length).toEqual(0);

      for (var i in filteredList) {
        expect(""+filteredList[i].order).toEqual(i);
      }
    }));
  });
});
