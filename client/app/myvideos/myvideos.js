'use strict';

angular.module('mapnApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('myvideos', {
        url: '/myvideos',
        templateUrl: 'app/myvideos/myvideos.html',
        controller: 'MyvideosCtrl'
      });
  });