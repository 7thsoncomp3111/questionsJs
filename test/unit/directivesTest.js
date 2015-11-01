'use strict';

describe('test todoEscape', function() {

  var compile;
  var rootScope;

  beforeEach(module('todomvc'));
  beforeEach(inject(function(_$compile_, _$rootScope_){
  
    compile = _$compile_;
    rootScope = _$rootScope_;
  }));

  it('todoEscape testing', function() {
    
    var element = compile("<todo-blur></todo-blur>")(rootScope);
    
    rootScope.$digest();
    element.triggerHandler({ type: "keydown", keyCode: 27, which: 27 });
    element.triggerHandler({ type: "keydown", keyCode: 72, which: 72 });
  });
});

describe('test todoFocus', function() {

  var compile;
  var rootScope;

  beforeEach(module('todomvc'));
  beforeEach(inject(function(_$compile_, _$rootScope_) {

    compile = _$compile_;
    rootScope = _$rootScope_;
  }));

  it('todoFocus testing', function() {
    
    var element = compile("<h2 todo-focus=true></h2>")(rootScope);
    
    rootScope.$digest();

    element = compile("<h2 todo-focus=false></h2>")(rootScope);
    rootScope.$digest();    
  });
});


