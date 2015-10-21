'use strict';

angular.module('mapnApp')
  .controller('PinCtrl', function ($scope, $stateParams, $http, $modal, $timeout, Auth) {
    var id = $stateParams.id;
    $scope.pin = {'id': id};
    $scope.error = '';

    $scope.uploadOpen = false;
    $scope.isLoggedIn = false;
    Auth.isLoggedInAsync(function(loggedIn) {
      $scope.isLoggedIn = loggedIn;
    });

    $scope.like = function(){
      $scope.countLike +=1;
    }

    $scope.dislike = function(){
      $scope.countDislike +=1;
    }

    $scope.addItem = function(file, errors) {
      if (!$scope.uploading) {
        $scope.uploading = true;
        $timeout(function() {
          var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'components/upload/upload.html',
            controller: 'UploadCtrl',
            resolve: {
              file: function () {
                return file;
              },
              pin: function() {
                return $scope.pin;
              },
              errors: function() {
                return errors;
              }
            }
          });
          modalInstance.result.then(function() {
            $scope.uploading = false;
          }, function() {
            $scope.uploading = false;
          });
        },100);
      }
    };

    $http.get('/api/pins/'+id).
      then(function(response) {
        var pin = response.data;
        $http.get('/api/entries?pin='+id).
          then(function(response) {
            pin.entries = response.data;
            $scope.pin = pin;
          }, function(error) {
            $scope.error = error.status + '\t' + error.statusText;
          });
      }, function(error) {
        $scope.error = error.status + '\t' + error.statusText;
    });
  });
