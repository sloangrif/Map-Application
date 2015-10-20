'use strict';

angular.module('mapnApp')
  .controller('PinCtrl', function ($scope, $stateParams, $http, $modal, $timeout) {
    var id = $stateParams.id;
    $scope.pin = {'id': id};
    $scope.error = '';

    $scope.countLike = 6;
    $scope.countDislike = 3;

    $scope.like = function(){
      $scope.countLike +=1;
    }

    $scope.dislike = function(){
      $scope.countDislike +=1;
    }

    $scope.addItem = function() {
        var modalInstance = $modal.open({
          animation: true,
          templateUrl: 'components/upload/upload.html',
          controller: 'UploadCtrl',
          resolve: {
            file: function () {
              return $scope.file;
            }
          }
        });
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
