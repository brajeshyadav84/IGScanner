angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {

    //initialize
    if(localStorage.getItem("LocalData") == null) {
        var data = [];
        data = JSON.stringify(data);
        localStorage.setItem("LocalData", data);
    }

    $scope.isScan = true;

    $scope.scan  = function() {
            cordova.plugins.barcodeScanner.scan(
                function (result) {
                    if(!result.cancelled)
                    {
                        console.log("result.format :: "+ result.format);
                        //if(result.format == "QR_CODE")
                        //{
                            navigator.notification.prompt("Please enter name of data",  function(input){
                                var name = input.input1;
                                var details = result.text;

                                var data = localStorage.getItem("LocalData");
                                console.log(data);
                                data = JSON.parse(data);
                                data[data.length] = {name, details};

                                localStorage.setItem("LocalData", JSON.stringify(data));
                                $scope.isScan = false;
                                $scope.scanURL = result.text;
                                $scope.$apply();
                            });
                        //}
                    }
                },
                function (error) {
                    alert("Scanning failed: " + error);
                }
           );
    };

    $scope.openURL = function () {
        window.open($scope.scanURL, '_system');
    }

})

.controller('ChatsCtrl', function($scope, $state) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

    $scope.chats = JSON.parse(localStorage.getItem("LocalData"));
    console.log("$scope.chats :: "+$scope.chats);
    
    $scope.remove = function(chat) {
      $scope.chats.remove(chat);
    };

    $scope.detailsHandler = function (data) {
        $state.go('tab.chat-detail', data);
    }

    

})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  console.log($stateParams.data);
  //$scope.chat = Chats.get();
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
