'use strict';

describe('TodoCtrl', function() {
  beforeEach(module('todomvc'));

  describe('escapeHTML Testing', function() {

    it('loaded escapeHTML', inject(function($filter) {
      expect($filter('escapeHTML')).not.toBeNull();
    }));

    it('does not contain special characters', inject(function(escapeHTMLFilter) { // need to put Filter suffix
		expect(escapeHTMLFilter('abc')).toEqual('abc');
    }));

    it('contains special characters', inject(function(escapeHTMLFilter) { // need to put Filter suffix
		expect(escapeHTMLFilter('abc<iframe>&"')).toEqual('abc&lt;iframe&gt;&amp;&quot;');
    }));
  });
});
