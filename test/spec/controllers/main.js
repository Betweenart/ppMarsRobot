'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('robotsOnMarsApp'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should have mars in the scope, that is initialised', function () {
    expect(scope.mars.initialized).toBe(true);
  });
});
