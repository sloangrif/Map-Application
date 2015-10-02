'use strict';

angular.module('mapnApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('pin', {
        url: '/pin/:id',
        templateUrl: 'app/pin/pin.html',
        controller: 'PinCtrl'
      });
  });
