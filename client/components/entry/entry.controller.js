'use strict';

angular.module('mapnApp')
  .controller('EntryCtrl', function ($scope, Upload, $location, $stateParams, $modalInstance, $timeout, $window, $http, id) {
    $scope.entry = {};
    $http.get('/api/entries/'+id).
          then(function(response) {
            $scope.entry = response.data;
          }, function(error) {
            $scope.error = error.status + '\t' + error.statusText;
          });

    $scope.page = $location.path();

    $scope.getUrl = function(path) {
      return $location.host() + path;
    }
});
