'use strict';

angular.module('mapnApp')
  .controller('SignupCtrl', function ($scope, Auth, $location, $window, vcRecaptchaService) {
    $scope.user = {};
    $scope.errors = {};
    $scope.recaptcha = {};

    $scope.rcResponse = function (response) {
      $scope.recaptcha.response = response;
    }

    $scope.rcCreate = function (id) {
      $scope.recaptcha.id = id;
    }

    $scope.rcExpiration = function() {
      console.info('Captcha expired. Resetting response object');
      $scope.recaptcha = {};
   };

    $scope.register = function(form) {
      $scope.submitted = true;
      var rc = $scope.recaptcha.response || '';

      if(form.$valid) {
        Auth.createUser({
          name: $scope.user.firstname + ' ' +  $scope.user.lastname,
          email: $scope.user.email,
          password: $scope.user.password,
          'g-recaptcha-response': rc
        })
        .then( function() {
          // Account created, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};
          vcRecaptchaService.reload($scope.recaptcha.id);

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };

    $scope.loginOauth = function(provider) {
      //$window.location.href = '/auth/' + provider;
    };
  });
