'use strict';

angular.module('mapnApp')
  .controller('SettingsCtrl', function ($scope, User, Auth, Modal) {
    $scope.errors = {};
    $scope.user = Auth.getCurrentUser() || {};

    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {

        Modal.confirm.changePassword(function(user) {
          console.log(user);
          Auth.changePassword( user.oldPassword, user.newPassword )
          .then( function() {
            $scope.message = 'Password successfully changed.';
          })
          .catch( function() {
            form.password.$setValidity('mongoose', false);
            $scope.errors.other = 'Incorrect password';
            $scope.message = '';
          });
        })($scope.user);
      }
		};
  });
