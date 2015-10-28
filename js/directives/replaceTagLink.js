/*global todomvc */
'use strict';

/**
* Directive that replaces DOM with tag links
*/
todomvc.directive('replacetaglink', function() {
    return {
        template: '<span class="inlinetag" ng-click="clickTag(trustedToken.title)" ng-if="trustedToken.hasTag">#{{trustedToken.title}}</span> <span ng-if="!trustedToken.hasTag">{{trustedToken.title}} </span>'
    }
});
