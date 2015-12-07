'use strict';

angular.module('mapnApp')
  .controller('UploadPinCtrl', function ($scope, $http, Upload, Auth, $timeout, $state) {
    $scope.uploading = false;
    $scope.error = '';
    $scope.progress = {
      value: 0,
      type: 'default'
    };
    $scope.map = { center: { latitude: 0, longitude: 0 }, zoom: 17 };
    $scope.marker =  {
      id: 0,
      coords: {
        'latitude': 0,
        'longitude': 0
      },
      options: { draggable: true },
    };

    $scope.submit = function(form) {
      if ($scope.uploading) {
        $scope.error = 'Please wait for the file to finish uploading';
      }
      else if (form.$valid) {
        $scope.error = '';
        upload($scope.video);
      } else {
        console.log(form.$error);
        $scope.error = 'Invalid form';
      }
    };

    var uploadVideo = function(file, pin) {
      var payload = $scope.modal || {};
      payload.pin = pin;
       file.upload = Upload.upload({
          url: '/api/entries/',
          method: 'POST',
          file: file,
          data: payload
      }).then(function (response) {
          $scope.progress.type = 'success';
          $timeout(function () {
              file.result = response.data;
              $state.transitionTo('main');
          }, 1000);
      }, function (error) {
          console.log('error:', error);
          if (error.status > 0) {
              $scope.error = error.data.message || error.statusText;
              $scope.progress.type = 'warning';
              $scope.uploading = false;
              $scope.progress.value = 100;
          }
      }, function (evt) {
          $scope.progress.MB = (evt.loaded / 1000000) || 1;
          file.progress = Math.min(100, parseInt(100.0 *
                                   evt.loaded / evt.total));
          // console.log(evt);
          $scope.progress.value = file.progress;
      });
    };

   var upload = function(file) {
      $scope.uploading = true;
      var pin = {
        name: 'Pin by: ' + (Auth.getCurrentUser()._id || ''),
        coordinates: [$scope.marker.coords.latitude, $scope.marker.coords.longitude]
      };
      $http.post('/api/pins/', pin)
        .then(function(response) {
          pin = response.data;
          uploadVideo(file, pin);
        }, function(error) {
          $scope.error = error.data.message || error.data || error.statusText || 'Server error';
          console.log(error);
        });
    };

    $scope.getLocation = (function () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
          $scope.map.center.latitude = position.coords.latitude;
          $scope.map.center.longitude = position.coords.longitude;
          $scope.marker.coords.latitude = position.coords.latitude;
          $scope.marker.coords.longitude = position.coords.longitude;

          $scope.$apply();
        });
      }
      else {
          $scope.error = 'Geolocation is not supported by this browser.';
      }
    })();

  });
