'use strict';

describe('Controller: PinCtrl', function () {

  // load the controller's module
  beforeEach(module('mapnApp'));

  var PinCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PinCtrl = $controller('PinCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
