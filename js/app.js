/*global angular */
/*jshint unused:false */
'use strict';

/**
 * The main TodoMVC app module
 *
 * @type {angular.Module}
 */
var todomvc = angular.module('todomvc', ['firebase', 'ngStorage']);

todomvc.filter('todoFilter', function ($location) {
	return function (input) {
		var sorted = [];
		var newQuestions = [];
		var sortedCount = 0;

		angular.forEach(input, function (todo) {
				if (todo.timestamp > new Date().getTime() - 180000) {
					todo.new = true;
					newQuestions.push(todo);
				} else if (sortedCount++<100){  // show top 100 only.
					todo.new = false;
				  sorted.push(todo);
        }
		});
		return newQuestions.concat(sorted);
	};
});
