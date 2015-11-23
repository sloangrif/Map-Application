'use strict';

angular.module('mapnApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/account/login/login.html',
        controller: 'LoginCtrl'
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupCtrl'
      })
      .state('biz', {
        url: '/biz',
        templateUrl: 'app/account/signup/biz/biz.html',
        controller: 'BizCtrl'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'app/account/settings/settings.html',
        controller: 'SettingsCtrl',
      })
      .state('settings.profile', {
        url: '/profile',
        templateUrl: 'app/account/settings/profile.html',
        controller: 'ProfileCtrl',
        authenticate: true,
      })
      .state('settings.password', {
        url: '/password',
        templateUrl: 'app/account/settings/password.html',
        controller: 'PasswordCtrl',
        authenticate: true,
      });
  });
