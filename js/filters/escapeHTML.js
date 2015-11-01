/*global todomvc, angular, Firebase */
'use strict';

var entityMap = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;',
	'/': '&#x2F;'
};

// code from https://github.com/janl/mustache.js/blob/master/mustache.js#L69
todomvc.filter('escapeHTML', function () {
  return function (input) {
	  return String(input).replace(/[&<>"'\/]/g, function fromEntityMap (s) {
		  return entityMap[s];
	  });
  };
});
