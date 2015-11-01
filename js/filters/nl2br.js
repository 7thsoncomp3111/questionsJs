/*global todomvc, angular, Firebase */
'use strict';

todomvc.filter('nl2br', function () {
  return function (input) {
	  return String(input).replace(/\n/g, '<br>');
  };
});
