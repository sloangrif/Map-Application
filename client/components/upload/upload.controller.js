'use strict';

angular.module('mapnApp')
  .controller('UploadCtrl', function ($scope, Upload, $stateParams, $modalInstance, $timeout, $window, $http, file) {
    $scope.modal = {pin: $stateParams.id}; // default
    $scope.file = file;
    console.log(file);
    $scope.progress = {
      value: 0,
      type: 'success'
    };
    $scope.loading = false;

    $scope.map = { center: { latitude: 0, longitude: 0 }, zoom: 14 };

    $http.get('/api/pins/'+$stateParams.id).
      then(function(response) {
        var markers = [];
        var pin = response.data;
        $scope.map.center.latitude = pin.coordinates[0];
        $scope.map.center.longitude = pin.coordinates[1]
        $scope.markers = [{
          'id': pin._id,
          'latitude': pin.coordinates[0],
          'longitude': pin.coordinates[1]
        }];
      }, function(error) {
        $scope.error = error.status + '\t' + error.statusText;
    });

    $scope.submit = function(form) {
      if (form.file.$valid && $scope.file) {
        $scope.upload($scope.file);
      }
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };

    $scope.upload = function(file, errFiles) {
      $scope.loading = true;
      file.upload = Upload.upload({
          url: '/api/entries/',
          method: 'POST',
          file: file,
          data: $scope.modal
      }).then(function (response) {
          $timeout(function () {
              file.result = response.data;
              $window.location.reload(); //TODO don't reload
          }, 1000);
      }, function (response) {
          if (response.status > 0) {
              $scope.errorMsg = response.status + ': ' + response.data;
              $scope.progress.type = 'warning';
              $scope.loading = false;
          }
      }, function (evt) {
          file.progress = Math.min(100, parseInt(100.0 *
                                   evt.loaded / evt.total));
          $scope.progress.value = file.progress;
      });
    }
  });
