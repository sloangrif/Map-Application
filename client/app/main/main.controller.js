'use strict';

angular.module('mapnApp')
  .controller('MainCtrl', function ($scope, $http, $location) {
    $scope.map = { center: { latitude: 29.6485, longitude: -82.345 }, zoom: 10 };
    $scope.markers = [];
    /* my var    */
    $scope.lat = "0";
    $scope.lng = "0";
    $scope.accuracy = "0";
    $scope.error = "";
    /* */
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

    /* my 
    $scope.mapOptions = {
      center: new google.maps.LatLng($scope.lat, $scope.lng),
      zoom:10
    }*/

    $scope.showPosition = function (position) {
      $scope.lat = position.coords.latitude;
      $scope.lng = position.coords.longitude;
      $scope.accuracy = position.coords.accuracy;
      $scope.$apply();

      var latlng = new google.maps.LatLnt($scope.lat, $scope.lng);
      $scope.model.myMap.setCenter(latlng);
    }
    $scope.showError = function (error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          $scope.error = "User denied the request for Geolocaiton."
          break;
        case error.POSITION_UNAVAILABLE:
          $scope.error = "Location information is unavailable."
          break;
        case error.TIMEOUT:
          $scope.error = "The request to get user locaiton timed out."
          break;
        case error.UNKNOWN_ERROR:
          $scope.error = "An unknown error occurred."
          break;
      };
      $scope.$apply();
    }  
    $scope.getLocation = function () {
      if(navigator.getlocation){
        navigator.geolocation.getCurrentPosition($scope.showPosition, $scope.showError);
      }
      else {
        $scope.error = "geolocation is not supported by this browser.";
      }
    };

   /*code */

   
    $scope.onClick = function (data, eventName, marker) {
        $location.path('/pin/' + marker.id);
    };
    

    $scope.addMarker = function(marker) {
      // Check that lat/long was input
      if (!marker || !marker.latitude || !marker.longitude) { return; }

      marker.id = $scope.markers.length;
      $scope.markers.push(marker);
    };

  })
  .controller('controlCtrl', function ($scope){
     $scope.controlText = 'I\'m a custom control';
        $scope.danger = false;
        $scope.controlClick = function () {
            $scope.danger = !$scope.danger;
            alert('custom control clicked!');
        };
  });

