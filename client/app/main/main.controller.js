'use strict';

angular.module('mapnApp')
  .controller('MainCtrl', function ($scope, $http, $location) {
    $scope.map = { center: { latitude: 29.6485, longitude: -82.345 }, zoom: 10 };
    $scope.markers = [];
    
    $scope.error = "";
    $scope.danger = false;
    $scope.lat = "10";
    $scope.lng ="10";
    var location = $scope.map.center.latitude + ',' + $scope.map.center.longitude;
    var radius   = $scope.map.zoom * 1000;
    var startPos;
    $http.get('/api/pins?location='+location+'&radius='+radius).
      then(function(response) {
        var markers = [];
        angular.forEach(response.data, function(pin) {
          var marker = {
            'id': pin._id,
            'latitude': pin.coordinates[0],
            'longitude': pin.coordinates[1]
          };
          markers.push(marker);
        });
        $scope.markers = markers;
      }, function(error) {
        $scope.error = error.status + '\t' + error.statusText;
    });

   
    $scope.onClick = function (data, eventName, marker) {
        $location.path('/pin/' + marker.id);
    };
    $scope.addMarker = function(marker) {
      // Check that lat/long was input
      if (!marker || !marker.latitude || !marker.longitude) { return; }

      marker.id = $scope.markers.length;
      $scope.markers.push(marker);
    };
    $scope.showResult = function () {
      return $scope.error == "";
    };
 
    $scope.showPosition = function (position) {
      console.log(position.coords.latitude);  
      console.log(position.coords.longitude); 
      //$scope.$apply(function(position){
      $scope.lat = position.coords.latitude;
      $scope.lng = position.coords.longitude;
     // });
     // var latlng = new google.maps.LatLnt(position.coords.latitude, position.coords.longitude);
      //$scope.map.setCenter(latlng);
    }
    $scope.showError = function (error) {
      switch (error.code) {
          case error.PERMISSION_DENIED:
              $scope.error = "User denied the request for Geolocation."
              break;
          case error.POSITION_UNAVAILABLE:
              $scope.error = "Location information is unavailable."
              break;
          case error.TIMEOUT:
              $scope.error = "The request to get user location timed out."
              break;
          case error.UNKNOWN_ERROR:
              $scope.error = "An unknown error occurred."
              break;
      }
      $scope.$apply();
    }
    $scope.getLocation = function () {

      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition($scope.showPosition, $scope.showError);

      }
      else {
          $scope.error = "Geolocation is not supported by this browser.";
      }
    }

  });



