'use strict';

angular.module('mapnApp')
  .controller('MainCtrl', function ($scope, $http, $location) {
    $scope.map = { center: { latitude: 29.6485, longitude: -82.345 }, zoom: 10 };
    $scope.markers = [];
    var location = $scope.map.center.latitude + ',' + $scope.map.center.longitude;
    var radius   = $scope.map.zoom * 1000;

    $http.get('/api/pins?location='+location+'&radius='+radius).
      then(function(response) {
        angular.forEach(response.data, function(pin) {
          var marker = {
            'id': pin._id,
            'latitude': pin.coordinates[0],
            'longitude': pin.coordinates[1]
          };
          $scope.markers.push(marker);
        });
      }, function(error) {
        $scope.error = error.status + '\t' + error.statusText;
    });

    $scope.onClick = function (data, eventName, marker) {
        $location.path('/pin/' + marker.id);
    };


    $scope.addMarker = function(marker) {
      // Check that lat/long was input
      if (!marker || !marker.latitude || !marker.longitude) return;

      marker.id = $scope.markers.length;
      $scope.markers.push(marker);
    }
  });

