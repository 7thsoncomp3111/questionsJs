'use strict';

describe('sorting the list of users', function() {
  it('sorts in descending order by default', function() {
    var users = ['jack', 'igor', 'jeff'];
    //    var sorted = sortUsers(users);
    //    expect(sorted).toEqual(['jeff', 'jack', 'igor']);
  });
});

describe('TodoCtrl', function() {
  beforeEach(module('todomvc'));
  // variables for injection
  var controller;
  var scope;
  var location;
  var firebaseArray;
  var sce;
  var localStorage;
  var window;
  

  // Injecting variables
  // http://stackoverflow.com/questions/13664144/how-to-unit-test-angularjs-controller-with-location-service
  beforeEach(inject(function($location,
    $rootScope,
    $controller,
    $firebaseArray,
    $localStorage,
    $sce,
    $window){
      // The injector unwraps the underscores (_) from around the parameter names when matching

      scope = $rootScope.$new();

      location = $location;
      controller = $controller;
      firebaseArray = $firebaseArray;
      sce = $sce;
      localStorage = $localStorage;
      window = $window;
    }));

    describe('TodoCtrl Testing', function() {
      it('setFirstAndRestSentence', function() {
        var ctrl = controller('TodoCtrl', {
          $scope: scope
        });

        var testInputs = [
          {str:"Hello? This is Sung", exp: "Hello?"},
          {str:"Hello.co? This is Sung", exp: "Hello.co?"},
          {str:"Hello.co This is Sung", exp: "Hello.co This is Sung"},
          {str:"Hello.co \nThis is Sung", exp: "Hello.co \n"},
          {str:"Hello?? This is Sung", exp: "Hello??"},


          {str:"Hello? This is Sung. ",exp:"Hello?"},
          {str:"Hello? This is Sung.! ",exp:"Hello?"}
          
        ];

        for (var i in testInputs) {
          var results = scope.getFirstAndRestSentence(testInputs[i].str);
          expect(results[0]).toEqual(testInputs[i].exp);
        }
      });

      it('RoomId', function() {
        location.path('/new/path');

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location
        });

        expect(scope.roomId).toBe("new");
      });

      it('toTop Testing', function() {

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location,
          $firebaseArray: firebaseArray,
          $sce: sce,
          $localStorage: localStorage,
          $window: window
        });

        scope.toTop();
        expect(window.scrollX).toBe(0);
        expect(window.scrollY).toBe(0);
      });

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      it('watchCollection', function() {

        var ctrl = controller('TodoCtrl', {
          $scope: scope
        });

        scope.todos=[{
          wholeMsg: "test testing",
          head: "meteor",
          headLastChar: "!",
          desc: "yeoman",
          linkedDesc: Autolinker.link("underscore!", {newWindow: false, stripPrefix: false}),
          completed: false,
          timestamp: new Date().getTime(),
          tags: "...",
          echo: 0,
          order: 0
        },
        {
          wholeMsg: "test testing2",
          head: "backbone",
          headLastChar: "!",
          desc: "",
          linkedDesc: Autolinker.link("", {newWindow: false, stripPrefix: false}),
          completed: false,
          timestamp: new Date().getTime(),
          tags: "...",
          echo: 3,
          order: 2
        },
        {
          wholeMsg: "test testing3",
          head: "backbone",
          headLastChar: "!",
          desc: "meteorJS",
          linkedDesc: Autolinker.link("", {newWindow: false, stripPrefix: false}),
          completed: false,
          timestamp: new Date().getTime(),
          tags: "...",
          echo: 3,
          order: 2
        },
        {}]

        scope.$digest();
      });

      /*it('test addTodo', function() {

        var ctrl = controller('TodoCtrl',{
          $scope: scope
        });

        scope.input = {
          wholeMsg: "test input",
          head: "head",
          headLastChar: "!",
          desc: "yeoman",
          linkedDesc: Autolinker.link("underscore!", {newWindow: false, stripPrefix: false}),
          completed: false,
          timestamp: new Date().getTime(),
          tags: "...",
          upvote: 0,
          downvote: 0,
          order: 0
        }
        
        scope.todos.$add = jasmine.createSpy("scope.todo.$add(todo) spy");
        scope.addTodo();
        expect(scope.todos.$add).toHaveBeenCalled();
      });

      it('test addTodo2', function() {

        var ctrl = controller('TodoCtrl',{
          $scope: scope
        });

        scope.input = {
          wholeMsg: "",
          head: "head",
          headLastChar: "!",
          desc: "yeoman",
          linkedDesc: Autolinker.link("underscore!", {newWindow: false, stripPrefix: false}),
          completed: false,
          timestamp: new Date().getTime(),
          tags: "...",
          upvote: 0,
          downvote: 0,
          order: 0
        };

        scope.todos.$add = jasmine.createSpy("scope.todo.$add(todo) spy");
        scope.addTodo();
        expect(scope.todos.$add).not.toHaveBeenCalled();
      });*/

      it('test upvote', function() {

        var ctrl = controller('TodoCtrl',{
          $scope: scope
        });

        var test = {
          wholeMsg: "backbone ",
          head: "head",
          headLastChar: "!",
          desc: "yeoman",
          linkedDesc: Autolinker.link("underscore!", {newWindow: false, stripPrefix: false}),
          completed: false,
          timestamp: new Date().getTime(),
          tags: "...",
          upvote: 0,
          downvote: 0,
          order: 0
        };

        scope.todos.$save = jasmine.createSpy("scope.todo.$save(todo) spy");
        scope.addUpvote(test);
        expect(scope.todos.$save).toHaveBeenCalled();
      });


      it('test downvote', function() {

        var ctrl = controller('TodoCtrl',{
          $scope: scope
        });

        var test = {
          wholeMsg: "backbone ",
          head: "head",
          headLastChar: "!",
          desc: "yeoman",
          linkedDesc: Autolinker.link("underscore!", {newWindow: false, stripPrefix: false}),
          completed: false,
          timestamp: new Date().getTime(),
          tags: "...",
          upvote: 0,
          downvote: 0,
          order: 0
        };

        scope.todos.$save = jasmine.createSpy("scope.todo.$save(todo) spy");
        scope.addDownvote(test);
        expect(scope.todos.$save).toHaveBeenCalled();
      });

      it('test doneEditing', function() {

        var ctrl = controller('TodoCtrl',{
          $scope: scope
        });        

        var test = {
          wholeMsg: "   test testing    ",
          head: "head",
          headLastChar: "!",
          desc: "yeoman",
          linkedDesc: Autolinker.link("underscore!", {newWindow: false, stripPrefix: false}),
          completed: false,
          timestamp: new Date().getTime(),
          tags: "...",
          echo: 0,
          order: 0
        };

        scope.todos.$save = jasmine.createSpy("scope.todo.$save(todo) spy");
        scope.doneEditing(test);
        expect(scope.todos.$save).toHaveBeenCalled();
      });
      
      it('test doneEditing2', function() {

        var ctrl = controller('TodoCtrl',{
          $scope: scope
        });        

        var test = {
          wholeMsg: "       ",
          head: "head",
          headLastChar: "!",
          desc: "yeoman",
          linkedDesc: Autolinker.link("underscore!", {newWindow: false, stripPrefix: false}),
          completed: false,
          timestamp: new Date().getTime(),
          tags: "...",
          echo: 0,
          order: 0
        };

        scope.todos.$save = jasmine.createSpy("scope.todo.$save(todo) spy");
        scope.doneEditing(test);
        expect(scope.todos.$save).not.toHaveBeenCalled();
      });

      it('test revertEditing', function () {
        
        var ctrl = controller('TodoCtrl',{
          $scope: scope
        });

        scope.originalTodo = {
          wholeMsg: "       ",
          head: "head",
          headLastChar: "!",
          desc: "yeoman",
          linkedDesc: Autolinker.link("underscore!", {newWindow: false, stripPrefix: false}),
          completed: false,
          timestamp: new Date().getTime(),
          tags: "...",
          echo: 0,
          order: 0
        };

        var test = {
          wholeMsg: "backbone ",
          head: "head",
          headLastChar: "!",
          desc: "yeoman",
          linkedDesc: Autolinker.link("underscore!", {newWindow: false, stripPrefix: false}),
          completed: false,
          timestamp: new Date().getTime(),
          tags: "...",
          echo: 0,
          order: 0
        };
        scope.revertEditing(test);
      });

      it('clearCompletedTodos Testing', function() {
      
          var ctrl = controller('TodoCtrl', {
            $scope: scope,
            $location: location,
            $firebaseArray: firebaseArray,
            $sce: sce,
            $localStorage: localStorage,
            $window: window
          });
      
          scope.todos=[{
            completed:true
          }];

          spyOn(scope,"removeTodo");
          scope.clearCompletedTodos();
          expect(scope.removeTodo).toHaveBeenCalled();

          scope.todos=[{
            completed:false
          }];

          scope.clearCompletedTodos();
      });
      
      it('test toogleCompleted', function() {

        var ctrl = controller('TodoCtrl',{
          $scope: scope
        });        

        var test = {
          wholeMsg: "test testing",
          head: "head",
          headLastChar: "!",
          desc: "yeoman",
          linkedDesc: Autolinker.link("underscore!", {newWindow: false, stripPrefix: false}),
          completed: false,
          timestamp: new Date().getTime(),
          tags: "...",
          echo: 0,
          order: 0
        };

        scope.todos.$save = jasmine.createSpy("scope.todo.$save(todo) spy");
        scope.toggleCompleted(test);
        expect(scope.todos.$save).toHaveBeenCalled();
      });

      it('test FBLogout', function() {

        var ctrl = controller('TodoCtrl',{
          $scope: scope
        });

        scope.FBLogout();
        expect(scope.isAdmin).toEqual(false);
      });
      
      it('test increaseMax', function() {

        var ctrl = controller('TodoCtrl',{
          $scope: scope
        });

        scope.maxQuestion = 10;
        scope.totalCount = 5;
        scope.increaseMax();
        expect(scope.maxQuestion).toEqual(10);
      });

      it('test increaseMax2', function() {

        var ctrl = controller('TodoCtrl',{
          $scope: scope
        });

        scope.maxQuestion = 5;
        scope.totalCount = 10;
        scope.increaseMax();
        expect(scope.maxQuestion).toEqual(15);
      });
    });
  });

