'use strict';

angular.module('mapnApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('user', {
        url: '/myvideos',
        templateUrl: 'app/myvideos/myvideos.html',
        controller: 'MyvideosCtrl'
      })
      
      .state("user.entry", {
        //abstract: true,
        parent: 'user',
        url: '/:entryid',
        onEnter: function($stateParams, $state, $modal) {
          var id = $stateParams.entryid;
          var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'components/entry/entry.html',
            controller: 'EntryCtrl',
            resolve: {
              id: function () {
                return id;
              }
            }
          });
          modalInstance.result.finally(function() {
            $state.go('^');
          });
        }
      });
  }
  		
  );