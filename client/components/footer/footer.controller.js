'use strict';

angular.module('mapnApp')
  .controller('FooterCtrl', function ($scope, $location, Auth) {
  	$scope.year = $filter('date')(new Date(), 'yyyy')
  });
