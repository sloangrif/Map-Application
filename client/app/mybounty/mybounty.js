'use strict';

angular.module('mapnApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('mybounty', {
        url: '/mybounty',
        templateUrl: 'app/mybounty/mybounty.html',
        controller: 'MybountyCtrl'
      });
  });