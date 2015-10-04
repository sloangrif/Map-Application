'use strict';

angular.module('mapnApp')
  .controller('MainCtrl', function ($scope, $http, $location) {
    $scope.map = { center: { latitude: 29.6485, longitude: -82.345 }, zoom: 10 };

    $scope.markers = [{
      id: 0,
      latitude: 29.6485,
      longitude: -82.3450,
    }]; 

    $scope.onClick = function (data, eventName, marker) {
        $location.path('/pin/' + marker.id);
    };


    $scope.addMarker = function(marker) {
      // Check that lat/long was input
      if (!marker || !marker.latitude || !marker.longitude) { return; }

      marker.id = $scope.markers.length;
      $scope.markers.push(marker);
    };

  });
