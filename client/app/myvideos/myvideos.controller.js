'use strict';

angular.module('mapnApp')
  .controller('MyvideosCtrl', function ($scope, Auth, User, $http, $timeout, $modal) {
    
    
    
  //$scope.uploadOpen = false;
  var userID = Auth.getCurrentUser();
  $scope.user = Auth.getCurrentUser();
/*$http.get('/api/user/'+id).
  then(function(response) {
    var user = response.data;
     
    $http.get('/api/entries?creator_id='+userID).
        then(function(response) {
          // do something with 'response' data
          user.entries = response.data;
          $scope.user = userID;
        }, function(error) {
          // handle error if needed
          $scope.error = error.status + '\t' + error.statusText;
        });
        });*/

  $http.get('/api/entries?creator_id='+userID).
      then(function(response) {
        // do something with 'response' data

        userID.entries = response.data;

        
      }, function(error) {
        // handle error if needed
        $scope.error = error.status + '\t' + error.statusText;
      });

      
    

});
/*
.controller('PinCtrl', function ($scope, $stateParams, $state, $http, $modal, $timeout, Auth) {
    var id = $stateParams.id;
    $scope.pin = {'id': id};
    $scope.error = '';

    $scope.uploadOpen = false;
    $scope.isLoggedIn = false;
    Auth.isLoggedInAsync(function(loggedIn) {
      $scope.isLoggedIn = loggedIn;
    });

    $scope.like = function(entry){
      if(entry.score != 1){
        if(entry.score==-1){
          entry.dislikes--;
        }
        entry.score = 1;
        entry.likes++;
        $http.post('/api/entries/' + entry._id + '/like');
      }
    };

    $scope.dislike = function(entry){
      if(entry.score != -1){
        if(entry.score==1){
          entry.likes--;
        }
        entry.score = -1;
        entry.dislikes++;
        $http.post('/api/entries/'+ entry._id + '/dislike');
      }
    };


    $scope.addItem = function(file, errors) {
      if (!$scope.uploading) {
        $scope.uploading = true;
        $timeout(function() {
          var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'components/upload/upload.html',
            controller: 'UploadCtrl',
            resolve: {
              file: function () {
                return file;
              },
              pin: function() {
                return $scope.pin;
              },
              errors: function() {
                return errors;
              }
            }
          });
          modalInstance.result.then(function() {
            $scope.uploading = false;
          }, function() {
            $scope.uploading = false;
          });
        },100);
      }
    };

    $scope.openEntry = function(entry) {
      $state.go('pin.entry', {'entryid': entry._id});
    };

    //TODO MOVE THIS TO SERVICE
    // allow for communication between pin & entry
    $http.get('/api/pins/'+id).
      then(function(response) {
        var pin = response.data;
        $http.get('/api/entries?pin='+id).
          then(function(response) {
            pin.entries = response.data;
            $scope.pin = pin;
          }, function(error) {
            $scope.error = error.status + '\t' + error.statusText;
          });
        if (pin.bounty) {
          $http.get('/api/bounties/'+pin.bounty).
            then(function(response) {
              pin.bounty = response.data;
            }, function(error) {
              $scope.error = error.status + '\t' + error.statusText;
            });
        }


      }, function(error) {
        $scope.error = error.status + '\t' + error.statusText;
    });
  });*/
