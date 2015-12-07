'use strict';

angular.module('mapnApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('upload_pin', {
        url: '/upload',
        templateUrl: 'app/upload/upload.html',
        controller: 'UploadPinCtrl'
      });
  });
