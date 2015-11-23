'use strict';

describe('TodoCtrl', function() {
  
  var ele, scope, compile, template;
  
  beforeEach(module('todomvc'));
  
  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();
    compile = $compile;
    template = '<div><h1 ng-if="test">Hello, world !</h1></div>';
  }));
  
  function ngIfDirective(expression) {
    var tpl = '<div ng-if="' + expression + '"></div>';
    ele = compile(tpl)(scope);
    scope.$digest();
  }

  describe('ngIf directive', function() {

    it('test 1', inject(function() {
      ngIfDirective('\'<iframe>\'');
      //expect(ele.replaceWith()).toEqual('<iframe class="ng-if"></iframe>');
    }));

    it('test 2', inject(function(){
      var tp2 = '<div ng-if="false"></div>'
      var elem = compile(tp2)(scope);
      ngIfDirective(' ');

    }));



  });
});
