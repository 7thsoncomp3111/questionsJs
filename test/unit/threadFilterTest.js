'use strict';

var threads = [
    {
		'$id': 'a',
        content: 'backbone',
		completed: false,
		timestamp: new Date().getTime(),
		upvote: 0,
		downvote: 0,
        author: 'anonymous',
        prev: '123'
    },
    {
		'$id': 'b',
        content: 'backbone',
        completed: false,
        timestamp: new Date().getTime(),
        upvote: 0,
        downvote: 0,
        author: 'anonymous',
        prev: '123'
    },
    {
		'$id': 'c',
        content: 'backbone',
        completed: false,
        timestamp: new Date().getTime(),
        upvote: 0,
        downvote: 0,
        author: 'anonymous',
        prev: '124'
    }
]

threads.$getRecord = function($id) {
	var result;
	this.forEach(function(record) {
		if (record.$id == $id) {
			result = record;
		}
	});
	return result;
}

describe('TodoCtrl', function() {
  beforeEach(module('todomvc'));

  describe('threadFilter Testing', function() {
    beforeEach(module(function($provide) {
      $provide.value('version', 'TEST_VER'); //TODO: what is this provide?
      console.log("provide.value: " + $provide.value);
    }));

    it('has a thread filter', inject(function($filter) {
      expect($filter('threadFilter')).not.toBeNull();
    }));
	
    it('thread filter - empty list', inject(function(threadFilterFilter) { // need to put Filter suffix
      var filteredList = threadFilterFilter([], '123');
	  expect(filteredList).toEqual(undefined);
    }));
	
    it('thread filter - empty result', inject(function(threadFilterFilter) { // need to put Filter suffix
      var filteredList = threadFilterFilter(threads, '123456');
	  expect(filteredList.length).toEqual(0);
    }));

    it('thread filter - filter prev', inject(function(threadFilterFilter) { // need to put Filter suffix
      var filteredList = threadFilterFilter(threads, '123');
	  expect(filteredList.length).toEqual(2);
    }));
	
  });
});
