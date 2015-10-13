'use strict';

angular.module('mapnApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('analytics', {
        url: '/analytics',
        templateUrl: 'app/analytics/analytics.html',
        controller: 'AnalyticsCtrl'
      });
  });