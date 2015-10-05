'use strict';

angular.module('mapnApp')
  .controller('PinCtrl', function ($scope, $stateParams, $http) {
    var id = $stateParams.id;
    $scope.pin = {'id': id};
    $scope.error = '';

    $http.get('/api/pins/'+id).
      then(function(response) {
        $scope.pin = response.data;
      }, function(error) {
        $scope.error = error.status + '\t' + error.statusText;
    });
  });
