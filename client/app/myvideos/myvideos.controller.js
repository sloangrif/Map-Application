'use strict';

angular.module('mapnApp')
  .controller('MyvideosCtrl', function ($scope, Auth, User, $state, $stateParams, $modal, $timeout, $http) {
  
  //gets user id
  var userID = Auth.getCurrentUser()._id;
  $scope.user = Auth.getCurrentUser();

    
//api call to get user entries
  $http.get('/api/entries?creator_id='+userID).
      then(function(response) {
        // do something with 'response' data
        $scope.entries = response.data;
        
        $scope.userID = userID;
        
      }, function(error) {
        // handle error if needed
        $scope.error = error.status + '\t' + error.statusText;
      });

     //opens video module  
    $scope.openEntry = function(entry) {
      $state.go('user.entry', {'entryid': entry._id});
    };
});


