'use strict';

describe('Controller: MybountyCtrl', function () {

  // load the controller's module
  beforeEach(module('mapnApp'));

  var MybountyCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MybountyCtrl = $controller('MybountyCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
