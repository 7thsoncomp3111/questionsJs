'use strict';

var list=[{
  wholeMsg: "newTodo",
  head: "head",
  headLastChar: "?",
  desc: "desc",
  linkedDesc: "#a",
  completed: false,
  timestamp: 0,
  tags: ['a'],
  upvote: 0,
  downvote: 0,
  order: 1
},{
  wholeMsg: "newTodo",
  head: "head",
  headLastChar: "?",
  desc: "desc",
  linkedDesc: "#b",
  completed: false,
  timestamp: 0,
  tags: ['b'],
  upvote: 0,
  downvote: 0,
  order: 2
},{
  wholeMsg: "newTodo",
  head: "head",
  headLastChar: "?",
  desc: "desc",
  linkedDesc: "#c",
  completed: false,
  timestamp: 0,
  tags: ['c'],
  upvote: 0,
  downvote: 0,
  order: 3
},{
  wholeMsg: "newTodo",
  head: "head",
  headLastChar: "?",
  desc: "desc",
  linkedDesc: "#a #c",
  completed: false,
  timestamp: 0,
  tags: ['a', 'c'],
  upvote: 10,
  downvote: 5,
  order: 3
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

    it('no tag filter', inject(function(tagFilterFilter) { // need to put Filter suffix
      var filteredList = tagFilterFilter(list, []);
	  expect(filteredList.length).toEqual(list.length);
    }));
	
    it('tag #a', inject(function(tagFilterFilter) { // need to put Filter suffix
      var filteredList = tagFilterFilter(list, ['a']);
	  expect(filteredList.length).toEqual(2);
    }));
	
    it('tag #b', inject(function(tagFilterFilter) { // need to put Filter suffix
      var filteredList = tagFilterFilter(list, ['b']);
	  expect(filteredList.length).toEqual(1);
    }));
	
    it('tag #c', inject(function(tagFilterFilter) { // need to put Filter suffix
      var filteredList = tagFilterFilter(list, ['c']);
	  expect(filteredList.length).toEqual(2);
    }));
	
    it('tag #d', inject(function(tagFilterFilter) { // need to put Filter suffix
      var filteredList = tagFilterFilter(list, ['d']);
	  expect(filteredList.length).toEqual(0); // no questions tagged with #d
    }));
	
    it('tag #a order', inject(function(tagFilterFilter) { // need to put Filter suffix
      var filteredList = tagFilterFilter(list, ['a']);
	  expect(filteredList[0].upvote).toEqual(list[list.length - 1].upvote);
    }));
	
  });
});
