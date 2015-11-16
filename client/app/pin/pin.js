'use strict';

angular.module('mapnApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('pin', {
        url: '/pin/:id',
        templateUrl: 'app/pin/pin.html',
        controller: 'PinCtrl'
      })
      .state("pin.entry", {
        //abstract: true,
        parent: 'pin',
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
  /*

*/

  );
