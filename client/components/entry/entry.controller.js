'use strict';

angular.module('mapnApp')
  .controller('EntryCtrl', function ($scope, Upload, Modal, $location, $stateParams, $modalInstance, $timeout, $window, $http, id) {
    $scope.entry = {};
    $http.get('/api/entries/'+id).
          then(function(response) {
            $scope.entry = response.data;
          }, function(error) {
            $scope.error = error.status + '\t' + error.statusText;
          });

    $scope.page = $location.path();

    $scope.getUrl = function(path) {
      return $location.protocol() + "://" + $location.host() + path;
    };

    $scope.getText = function(text) {
      return text + ' via mapn.mobi'
    };

    $scope.close = function() {
        $modalInstance.close($scope.entry);
    };

    var deleteEntry = Modal.confirm.delete(function(entry) {
      var id = entry._id;
      $http.delete('/api/entries/'+id).
          then(function(response) {
            $scope.entry = {};
            $scope.close();
          }, function(error) {
            $scope.error = error.status + '\t' + error.statusText;
          });
    });

    $scope.delete = function() {
      deleteEntry('video ' + $scope.entry._id, $scope.entry);
    };


});
