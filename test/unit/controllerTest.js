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

      it('getFirstAndRestSentence', function() {

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

      it('roomId - empty', function() {

        location.path('/');

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location
        });

        expect(scope.roomId).toBe("all");
      });

      it('roomId - non-empty', function() {

        location.path('/comp3111');

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location
        });

        expect(scope.roomId).toBe("comp3111");
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
          wholeMsg: "test testing #a",
          head: "meteor",
          headLastChar: "!",
          desc: "yeoman",
          linkedDesc: Autolinker.link("underscore!", {newWindow: false, stripPrefix: false}),
          completed: false,
          timestamp: new Date().getTime(),
          upvote: 0,
		  downvote: 0,
          order: 0
        },
        {
          wholeMsg: "test testing2 #b",
          head: "backbone",
          headLastChar: "!",
          desc: "",
          linkedDesc: Autolinker.link("", {newWindow: false, stripPrefix: false}),
          completed: false,
          timestamp: new Date().getTime(),
          upvote: 3,
		  downvote: 0,
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
          upvote: 2,
		  downvote: 2,
          order: 2
        },
        {}]

        scope.$digest();

		// vote percentage
		expect(scope.todos[0].upvotePercent).toEqual(0);
		expect(scope.todos[0].downvotePercent).toEqual(0);

		expect(scope.todos[1].upvotePercent).toEqual(100);
		expect(scope.todos[1].downvotePercent).toEqual(0);

		expect(scope.todos[2].upvotePercent).toEqual(50);
		expect(scope.todos[2].downvotePercent).toEqual(50);

		// tags
		expect(scope.todos[0].tags).toEqual(['a']);
		expect(scope.todos[1].tags).toEqual(['b']);
		expect(scope.todos[2].tags).toEqual([]);

		// ranked tags
		expect(scope.rankedTags.length).toEqual(2);
		expect(scope.rankedTags[0]).toEqual({ title: 'a', count: 1 });
		expect(scope.rankedTags[1]).toEqual({ title: 'b', count: 1 });

		// total count
		expect(scope.totalCount).toEqual(3);

      });

      it('test addTodo - empty input', function() {

        var ctrl = controller('TodoCtrl',{
          $scope: scope
        });

		scope.getFirstAndRestSentence = jasmine.createSpy("scope.getFirstAndRestSentence");

		scope.input = { messagetext: '' };
		scope.addTodo();

		// as the input is empty
		expect(scope.getFirstAndRestSentence).not.toHaveBeenCalled();

      });

      it('test addTodo - has input', function() {

        var ctrl = controller('TodoCtrl',{
          $scope: scope
        });

		scope.todos.$add = jasmine.createSpy("scope.todos.$add(todo)");

		var len = scope.todos.length;

		scope.input = { messagetext: 'test' };
		scope.addTodo();

		expect(scope.todos.$add).toHaveBeenCalled();
		expect($(".q-input").text()).toEqual('');
		expect(scope.input).toEqual({}); // cleared input

      });

      it('test upvote', function() {

        var ctrl = controller('TodoCtrl',{
          $scope: scope
        });

        var test = {
		  '$id': '123',
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
		expect(test.upvote).toEqual(1);
		expect(test.order).toEqual(-1);
        expect(scope.todos.$save).toHaveBeenCalled();
		expect(localStorage['123']).toEqual(true);
      });


      it('test downvote', function() {

        var ctrl = controller('TodoCtrl',{
          $scope: scope
        });

        var test = {
		  '$id': '456',
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
		expect(test.downvote).toEqual(1);
		expect(test.order).toEqual(-1);
        expect(scope.todos.$save).toHaveBeenCalled();
		expect(localStorage['456']).toEqual(true);
      });

      it('test setOrderpref', function() {

        var ctrl = controller('TodoCtrl',{
          $scope: scope
        });

		var pref = 'vote';
		scope.setOrderpref(pref);
		expect(scope.orderpref).toEqual(pref);
      });

      it('test clickTag - already tagged', function() {

        var ctrl = controller('TodoCtrl',{
          $scope: scope
        });

		scope.tagsearch = false;
		scope.tagsearchitems = ['a'];

		scope.clickTag('a');

		expect(scope.tagsearch).toEqual(false); // unchanged
		expect(scope.tagsearchitems.length).toEqual(1); // unchanged

      });

      it('test clickTag - new tag', function() {

        var ctrl = controller('TodoCtrl',{
          $scope: scope
        });

		scope.tagsearch = false;
		scope.tagsearchitems = [];

		scope.clickTag('a');

		expect(scope.tagsearch).toEqual(true);
		expect(scope.tagsearchitems.length).toEqual(1);

      });

      it('test clearTag - null', function() {

        var ctrl = controller('TodoCtrl',{
          $scope: scope
        });

		scope.clearTag(null);
		expect(scope.tagsearch).toEqual(false);
		expect(scope.tagsearchitems.length).toEqual(0);

      });

      it('test clearTag - not null (original 1 tag)', function() {

        var ctrl = controller('TodoCtrl',{
          $scope: scope
        });

		scope.tagsearch = true;
		scope.tagsearchitems = ['a'];

		scope.clearTag(0);
		expect(scope.tagsearch).toEqual(false);
		expect(scope.tagsearchitems.length).toEqual(0);

      });

      it('test clearTag - not null (original 2 tags)', function() {

        var ctrl = controller('TodoCtrl',{
          $scope: scope
        });

		scope.tagsearch = true;
		scope.tagsearchitems = ['a', 'b'];

		scope.clearTag(0);
		expect(scope.tagsearch).toEqual(true);
		expect(scope.tagsearchitems.length).toEqual(1);
		expect(scope.tagsearchitems[0]).toEqual('b'); // removed index 0 (a), so b left

      });

	  it('test removeTodo', function() {

          var ctrl = controller('TodoCtrl',{
            $scope: scope
          });

		  scope.todos.$remove = jasmine.createSpy('scope.todos.$remove');
		  scope.removeTodo({});
		  expect(scope.todos.$remove).toHaveBeenCalled();

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

      it('test scroll event (pass)', function() {

        var ctrl = controller('TodoCtrl',{
          $scope: scope
        });

		// make it 100% to pass the condition test
		window.innerHeight = 10000;
		window.scrollY = 10000;

		scope.maxQuestion = 100;
		scope.totalCount = 1000;

		var w = angular.element(window);
		w.triggerHandler('scroll');

		expect(scope.maxQuestion).toEqual(110);

      });

      it('test scroll event (not pass)', function() {

        var ctrl = controller('TodoCtrl',{
          $scope: scope
        });

		// make it 100% not to pass the condition test
		window.innerHeight = 0;
		window.scrollY = -1000;

		scope.maxQuestion = 100;
		scope.totalCount = 1000;

		var w = angular.element(window);
		w.triggerHandler('scroll');

		expect(scope.maxQuestion).toEqual(100); // unchanged

      });

    it('test getNumOfThreads 2 in 3', function() {

        var ctrl = controller('TodoCtrl',{
          $scope: scope
        });

        scope.threads = [
            {
                content: 'backbone',
        		completed: false,
        		timestamp: new Date().getTime(),
        		upvote: 0,
        		downvote: 0,
                author: 'anonymous',
                prev: '123'
            },
            {
                content: 'backbone',
                completed: false,
                timestamp: new Date().getTime(),
                upvote: 0,
                downvote: 0,
                author: 'anonymous',
                prev: '123'
            },
            {
                content: 'backbone',
                completed: false,
                timestamp: new Date().getTime(),
                upvote: 0,
                downvote: 0,
                author: 'anonymous',
                prev: '124'
            }
        ]

        var test = {
        '$id': '123',
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

      expect(scope.getNumOfThreads(test.$id)).toEqual(2);
      });
      
      it('test checkExistSubscription', function(){
        var ctrl = controller('TodoCtrl',{
          $scope: scope
        })
        scope.subscriptions = [
          {
            email:"7thsoncomp3111@gmail.com",
            id: "-K3p9_Qo5uSu7Anm02Hn"
          },
          {
            email:"bahikiv@vkcode.ru",
            id: "-K3p9_Qo5uSu7Anm02Hn"
          },
          {
            email:"rowijaya@ust.hk",
            id: "-K3pF3IrMR68R-CRyle2"
          }
        ]
        expect(scope.checkExistSubscription('7thsoncomp3111@gmail.com','-K3p9_Qo5uSu7Anm02Hn')).toEqual(true);
      });


      it('test getNumSubscription', function() {
        var ctrl = controller('TodoCtrl',{
          $scope: scope
        });
        scope.subscriptions = [
          {
            email:"7thsoncomp3111@gmail.com",
            id: "-K3p9_Qo5uSu7Anm02Hn"
          },
          {
            email:"bahikiv@vkcode.ru",
            id: "-K3p9_Qo5uSu7Anm02Hn"
          },
          {
            email:"rowijaya@ust.hk",
            id: "-K3pF3IrMR68R-CRyle2"
          }
        ]
        expect(scope.getNumSubscription('-K3p9_Qo5uSu7Anm02Hn')).toEqual(2);
      });

      it('test subscribeAction already subscribed', function() {
        var ctrl = controller('TodoCtrl',{
          $scope: scope
        });
        scope.subscriptions = [
          {
            email:"7thsoncomp3111@gmail.com",
            id: "-K3p9_Qo5uSu7Anm02Hn"
          },
          {
            email:"bahikiv@vkcode.ru",
            id: "-K3p9_Qo5uSu7Anm02Hn"
          },
          {
            email:"rowijaya@ust.hk",
            id: "-K3pF3IrMR68R-CRyle2"
          }
        ]
        var email = '7thsoncomp3111@gmail.com';
        var qid = '-K3p9_Qo5uSu7Anm02Hn';
        expect(scope.subscribeAction(qid)).toEqual(2);
      });

      it('test addTodo2', function(){
        var ctrl = controller('TodoCtrl',{
          $scope: scope
        });
        scope.todos.$add = jasmine.createSpy('scope.todos.$add');
        scope.addTodo2({});
        expect(scope.todos.$add).toHaveBeenCalled();
      });

      it('test addTodo', function(){
        var ctrl = controller('TodoCtrl',{
          $scope: scope
        });

        scope.todos.$add = jasmine.createSpy('scope.todos.$add(todo)');
        var len = scope.todos.length;
        scope.input = { messagetext: 'test' };
        scope.addTodo('1.png');
        expect(scope.todos.$add).not.toHaveBeenCalled();
      });

    });
  });
