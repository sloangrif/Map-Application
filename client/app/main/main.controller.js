'use strict';

angular.module('mapnApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.map = { center: { latitude: 29.6485, longitude: -82.345 }, zoom: 1 };

    $scope.markers = [{
      id: 0,
      latitude: 29.6485,
      longitude: -82.3450,
    }];

    $scope.addMarker = function(marker) {
      // Check that lat/long was input
      if (!marker || !marker.latitude || !marker.longitude) return;

      marker.id = $scope.markers.length;
      $scope.markers.push(marker);
    }
  });
