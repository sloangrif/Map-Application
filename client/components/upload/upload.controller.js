'use strict';

angular.module('mapnApp')
  .controller('UploadCtrl', function ($scope, Upload, $stateParams) {
     $scope.uploadFiles = function(file, errFiles) {
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        $scope.modal = {pin: $stateParams.id};
        if (file) {
            file.upload = Upload.upload({
                url: '/api/entries/',
                method: 'POST',
                file: file,
                data: $scope.modal
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 * 
                                         evt.loaded / evt.total));
            });
        }   
    };

  });
