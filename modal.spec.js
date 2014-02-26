'use strict';

describe('btfModal', function() {
  var btfModal,
      container,
      rootScope,
      body = angular.element(window.document.body);

  beforeEach(module('btford.modal'));

  beforeEach(inject(function(_btfModal_, $rootScope, $templateCache, _$httpBackend_) {
    btfModal  = _btfModal_;
    rootScope = $rootScope;
    rootScope.greeting = 'こんばんは';

    $templateCache.put('test.html', [200, '<div>{{greeting}}</div>', {}]);

    container = angular.element('<div></div>');
  }));

  afterEach(function() {
    container = null;
  });


  it('should not show a modal initially', function() {
    var modal = btfModal({
      templateUrl: 'test.html',
      container: container
    });

    rootScope.$digest();

    expect(container.text()).toBe('');
  });


  it('should throw if called without a `template` or `templateUrl` option', function() {
    expect(function () { btfModal({}); }).toThrow();
  });

  it('should throw if called with both `template` and `templateUrl` options', function() {
    expect(function () {
      btfModal({
        template: 'foo',
        templateUrl: 'foo.html'
      });
    }).toThrow();
  });

  describe('#activate', function () {
    it('should show a modal when activated with `templateUrl`', function() {
      var modal = btfModal({
        templateUrl: 'test.html',
        container: container
      });
      modal.activate();
      rootScope.$digest();

      expect(container.text()).toBe('こんばんは');
    });

    it('should show a modal when activated with `template`', function() {
      var modal = btfModal({
        template: '<span>{{greeting}}</span>',
        container: container
      });

      modal.activate();
      rootScope.$digest();

      expect(container.text()).toBe('こんばんは');
    });

    it('should instantiate a controller via the `controller` option', function() {
      var modal = btfModal({
        template: '<span>{{greeting}}</span>',
        controller: function ($scope) {
          $scope.greeting = 'goodnight'
        },
        container: container
      });

      modal.activate();
      rootScope.$digest();

      expect(container.text()).toBe('goodnight');
    });

    it('should expose a controller to the scope via the `controllerAs` option', function() {
      var modal = btfModal({
        template: '<span>{{ctrl.greeting}}</span>',
        controller: function () {
          this.greeting = 'boa noite'
        },
        controllerAs: 'ctrl',
        container: container
      });

      modal.activate();
      rootScope.$digest();

      expect(container.text()).toBe('boa noite');
    });

    it('should pass locals to the modal scope', function() {
      var modal = btfModal({
        template: '<span>{{greeting}}</span>',
        container: container
      });

      modal.activate({
        greeting: 'bon soir'
      });
      rootScope.$digest();

      expect(container.text()).toBe('bon soir');
    });

    it('should not activate multiple times', function() {
      var modal = btfModal({
        template: '<span>x</span>',
        container: container
      });

      modal.activate();
      rootScope.$digest();
      modal.activate();
      rootScope.$digest();

      expect(container.text()).toBe('x');
    });
  });


  describe('#deactivate', function () {
    it('should remove a modal when deactivated', function() {

      var modal = btfModal({
        template: '<span>{{greeting}}</span>',
        container: container
      });

      modal.activate();
      rootScope.$digest();

      modal.deactivate();
      rootScope.$digest();

      expect(container.text()).toBe('');
    });
  });


  describe('#active', function () {
    it('should return the state of the modal', function() {

      var modal = btfModal({
        template: '<span>{{greeting}}</span>',
        container: container
      });

      rootScope.$digest();
      expect(modal.active()).toBe(false);

      modal.activate();
      rootScope.$digest();
      expect(modal.active()).toBe(true);

      modal.deactivate();
      rootScope.$digest();
      expect(modal.active()).toBe(false);
    });
  });


});
