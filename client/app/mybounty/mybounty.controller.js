'use strict';

angular.module('mapnApp')
  .controller('MybountyCtrl', function ($scope, Auth, $http, $state, $stateParams) {
    $scope.message = 'Hello';
    var id = $stateParams.id;
    $scope.user = {'id':id};
    var userID = Auth.getCurrentUser();
    $scope.user = Auth.getCurrentUser();
    
    $http.get('/api/bounties/'+userID).
    
    then(function(response){
    	user.bounty = response.data;
    }, function(error){
    	$scope.error = error.status + '\t' + error.statusText;
    });

  });
