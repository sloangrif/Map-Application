'use strict';

describe('Controller: MyvideosCtrl', function () {

  // load the controller's module
  beforeEach(module('mapnApp'));

  var MyvideosCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MyvideosCtrl = $controller('MyvideosCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
