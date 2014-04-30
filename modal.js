/*
 * @license
 * angular-modal v0.2.1
 * (c) 2013 Brian Ford http://briantford.com
 * License: MIT
 */

'use strict';

angular.module('btford.modal', []).
factory('btfModal', function ($compile, $rootScope, $controller, $q, $http, $templateCache) {
  return function modalFactory (config) {

    if ((+!!config.template) + (+!!config.templateUrl) !== 1) {
      throw new Error('Expected modal to have exacly one of either `template` or `templateUrl`');
    }

    var template      = config.template,
        controller    = config.controller || angular.noop,
        controllerAs  = config.controllerAs,
        container     = angular.element(config.container || document.body),
        open	 	  = config.open || angular.noop,
        close 		  = config.close || angular.noop,
        element       = null,
        deferred	  = null,
        html,
        scope;

    if (config.template) {
      var deferred = $q.defer();
      deferred.resolve(config.template);
      html = deferred.promise;
    } else {
      html = $http.get(config.templateUrl, {
        cache: $templateCache
      }).
      then(function (response) {
        return response.data;
      });
    }

    function activate (locals) {
      deferred = $q.defer();
      
      html.then(function (html) {
        if (!element) {
          attach(html, locals);
		  open(element);                
          return deferred.promise;
        }
      });
      
      return $q.reject();
    }

    function attach (html, locals) {
      element = angular.element(html);
      container.prepend(element);
      scope = $rootScope.$new();
      if (locals) {
        for (var prop in locals) {
          scope[prop] = locals[prop];
        }
      }
      var ctrl = $controller(controller, { $scope: scope });
      if (controllerAs) {
        scope[controllerAs] = ctrl;
      }
      $compile(element)(scope);
    }

    function deactivate (exitCode) {
      if (element) {
        scope.$destroy();
    	close(element);
        element.remove();
        element = null;
        deferred.resolve(exitCode);
      }
    }

    function active () {
      return !!element;
    }
    
    return {
      activate: activate,
      deactivate: deactivate,
      active: active,
    };
  };
});
