
'use strict';

angular.module('mapnApp')
  .controller('MainCtrl', function ($scope, $http, $location) {
    $scope.error = "";
    $scope.danger = false;
    $scope.lat = "28.6485";
    $scope.lng = "-82.345";

    $scope.map = { center: { latitude: $scope.lat, longitude: $scope.lng }, zoom: 10 };
    $scope.markers = [];
    
    var location = $scope.map.center.latitude + ',' + $scope.map.center.longitude;
    var radius   = $scope.map.zoom * 1000;

    
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
    };

    $scope.test = function(){
      console.log("test");
    };

    $scope.getLocation = function () {
      
      if (navigator.geolocation) {
          console.log("getlocation");
          navigator.geolocation.getCurrentPosition(function(position){
            console.log(position);
            $scope.lat = position.coords.latitude;
            $scope.lng = position.coords.longitude;
            $scope.map.center.latitude = position.coords.latitude;
            $scope.map.center.longitude = position.coords.longitude;
            $scope.$apply();
          });

      }
      else {
          $scope.error = "Geolocation is not supported by this browser.";
      }
      

    }

    $scope.getLocation();
    
  });



