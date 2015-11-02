'use strict';

describe('TodoCtrl', function() {
  beforeEach(module('todomvc'));

  describe('nl2br Testing', function() {

    it('loaded nl2br', inject(function($filter) {
      expect($filter('nl2br')).not.toBeNull();
    }));

    it('does not contain line breaks', inject(function(nl2brFilter) { // need to put Filter suffix
		expect(nl2brFilter('abc')).toEqual('abc');
    }));

    it('contains line breaks', inject(function(nl2brFilter) { // need to put Filter suffix
		expect(nl2brFilter('abc\ndef')).toEqual('abc<br>def');
    }));
  });
});
