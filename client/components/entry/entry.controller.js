'use strict';

angular.module('mapnApp')
  .controller('EntryCtrl', function ($scope, Upload, $stateParams, $modalInstance, $timeout, $window, $http, entry) {
    $scope.entry = entry;
});
