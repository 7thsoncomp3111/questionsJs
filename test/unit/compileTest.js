'use strict';

describe('TodoCtrl', function() {
	
	var ele, scope, compile;
	
  beforeEach(module('todomvc'));
  
  beforeEach(inject(function($rootScope, $compile) {
	  scope = $rootScope.$new();
	  compile = $compile;
  }));
  
  function compileDirective(expression) {
	  var tpl = '<div compile="' + expression + '"></div>';
	  ele = compile(tpl)(scope);
	  scope.$digest();
  }

  describe('compile directive', function() {

    it('plain text', inject(function() {
		compileDirective('\'abc\'');
		expect(ele.html()).toEqual('<span class="ng-scope">abc</span>');
    }));

    it('raw HTML', inject(function() {
		compileDirective('\'<iframe>\'');
		expect(ele.html()).toEqual('<iframe class="ng-scope"></iframe>');
    }));
	
    it('scope variable', inject(function() {
		scope.test = 'abc';
		compileDirective('test');
		expect(ele.html()).toEqual('<span class="ng-scope">' + scope.test + '</span>');
    }));
    
  });
});
