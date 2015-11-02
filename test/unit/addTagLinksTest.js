'use strict';

describe('TodoCtrl', function() {
  beforeEach(module('todomvc'));

  describe('addTagLinks Testing', function() {

    it('loaded addTagLinks', inject(function($filter) {
      expect($filter('addTagLinks')).not.toBeNull();
    }));

    it('does not contain tags', inject(function(addTagLinksFilter) { // need to put Filter suffix
		expect(addTagLinksFilter('abc')).toEqual('abc');
    }));

    it('contains tags', inject(function(addTagLinksFilter) { // need to put Filter suffix
		expect(addTagLinksFilter('abc #d')).toEqual('abc <span class="inlinetag" ng-click="clickTag(\'d\')">#d</span>');
    }));
  });
});
