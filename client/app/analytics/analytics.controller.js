'use strict';

angular.module('mapnApp')
  .controller('AnalyticsCtrl', function ($scope, $http, Auth) {
    $scope.message = 'Hello';
    
    $http.get('/api/pins/').
      then(function(response) {
      	var pins = [];
        angular.forEach(response.data, function(pin) {
        	var pin = {
        		'id': pin._id,
        		'name': pin.name,
        		'description': pin.description
        	};
        	pins.push(pin);
        });
        $scope.pins = pins;
      }, function(error) {
        $scope.error = error.status + '\t' + error.statusText;
    });
  });
