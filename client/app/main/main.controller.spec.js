'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('mapnApp'));

  var MainCtrl,
      scope,
      $httpBackend;

  //Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of markers to the scope', function () {
    expect(scope.markers.length).toBe(1);
    scope.addMarker({'latitude':20, 'longitude':20});
    expect(scope.markers.length).toBe(2);
    expect(scope.markers[1].id).toBe(1);
  });
});
