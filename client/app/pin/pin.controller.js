'use strict';

angular.module('mapnApp')
  .controller('PinCtrl', function ($scope, $stateParams, $http) {
    var pin_id = $stateParams.id;
    $scope.pin = {'id': pin_id};
    $scope.error = '';

    $http.get('/api/pin/'+pin_id).
      then(function(response) {
        $scope.pin = response.data;
      }, function(error) {
        $scope.error = error.status + '\t' + error.statusText;
    });
  });
