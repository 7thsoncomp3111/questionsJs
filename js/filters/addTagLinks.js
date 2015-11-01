/*global todomvc, angular, Firebase */
'use strict';

// code from https://github.com/janl/mustache.js/blob/master/mustache.js#L69
todomvc.filter('addTagLinks', function () {
  return function (input) {
	  return String(input).replace(/#([\w\-]+)/g, function (match, tag) {
		  return '<span class="inlinetag" ng-click="clickTag(\'' + tag + '\')">#' + tag + '</span>';
	  });
  };
});
