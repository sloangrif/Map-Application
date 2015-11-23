'use strict';

angular.module('mapnApp')
  .controller('SettingsCtrl', function ($scope, $state) {
    console.log($state.current.name);
    $scope.actions = [
      { name: 'Profile',
        state: 'settings.profile',
      },
      { name: 'Password',
        state: 'settings.password',
      }
    ];

    angular.forEach($scope.actions, function(value) {
      if ($state.current.name === value.state) {
        value.active = true;
      }
      else {
        value.active = false;
      }
    });

    $scope.openAction = function(action) {
      angular.forEach($scope.actions, function(value) {
        if (action.name === value.name) {
          value.active = true;
        }
        else {
          value.active = false;
        }
      });
      $state.transitionTo(action.state);
    };

  })
  .controller('PasswordCtrl', function ($scope, User, Auth, Modal) {
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
  })
  .controller('ProfileCtrl', function ($scope, User, Auth) {
    $scope.errors = {};
    $scope.user = Auth.getCurrentUser() || {};

    $scope.changeProfile = function(form) {
      $scope.submitted = true;
      if (form.$valid) {
        delete $scope.user.oldPassword;
        delete $scope.user.newPassword;
        Auth.changeCurrentProfile($scope.user)
        .then( function() {
          $scope.message = 'Password successfully changed.';
        })
        .catch( function() {
          form.$setValidity('mongoose', false);
          $scope.errors.other = 'Failed to save profile';
          $scope.message = '';
        });
      }
    };
  });
