'use strict';

angular.module('mapnApp')
  .controller('PinCtrl', function ($scope, $stateParams, $http) {
    var id = $stateParams.id;
    $scope.pin = {'id': id};
    $scope.error = '';

    $scope.countLike = 6;
    $scope.countDislike = 3;

    $scope.like = function(entry){
      if(entry.score==0){
        entry.score = 1;
        entry.likes++;
      }
    }

    $scope.dislike = function(entry){
      if(entry.score==0){
        entry.score = -1;
        entry.dislikes++;
      }
    }
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
