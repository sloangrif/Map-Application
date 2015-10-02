'use strict';

angular.module('mapnApp')
  .controller('PinCtrl', function ($scope) {
    $scope.pin_id = $routeParams.id || "No id specified";
  });
