angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {

    //initialize
    if(localStorage.getItem("LocalData") == null) {
        var data = [];
        data = JSON.stringify(data);
        localStorage.setItem("LocalData", data);
    }

    if(!!localStorage.getItem("SettingData")) {
        var settings = {
            disableSuccessBeep: true,
            disableAnimations: true,
            torchOn: true,
            preferFrontCamera: false
        };
        localStorage.setItem("SettingData", JSON.stringify(settings));
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
                                if(result.format != "QR_CODE") {
                                    name = "Product"
                                }
                                var details = result.text;

                                var data = localStorage.getItem("LocalData");
                                console.log(data);
                                data = JSON.parse(data);
                                var id = data.length;
                                if(id > 20){
                                  data.splice(0, 1);
                                }
                                data[data.length] = { id, name, details};

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
                },
                {
                    preferFrontCamera : false, // iOS and Android
                    showFlipCameraButton : true, // iOS and Android
                    showTorchButton : true, // iOS and Android
                    torchOn: false, // Android, launch with the torch switched on (if available)
                    // prompt : "Place a barcode inside the scan area", // Android
                    // resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                    // formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
                    // orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
                    disableAnimations : true, // iOS
                    disableSuccessBeep: false // iOS
                }
           );
    };

    $scope.openURL = function () {
        window.open($scope.scanURL, '_system');
    }

})

.controller('HistoryCtrl', function($scope, $state) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
    $scope.chats = JSON.parse(localStorage.getItem("LocalData"));
    if($scope.chats.length > 0) {
        console.log("$scope.chats :: "+$scope.chats);
        $scope.isDataAvailable = false;
    } else {
        $scope.isDataAvailable = true;
    }
    
    
    $scope.remove = function(id) {
      //$scope.chats.remove(chat);
      console.log(id);
      var id = id - 1;
      $scope.chats.splice(id, 1);
      localStorage.setItem("LocalData", JSON.stringify($scope.chats));

    };

    $scope.detailsHandler = function (data) {
        $state.go('tab.history-detail', {"name": data.name,"details": data.details});
    }

    

})

.controller('HistoryDetailCtrl', function($scope, $stateParams) {
  console.log($stateParams.name);
  //$scope.chat = Chats.get();
  $scope.name = $stateParams.name;
  if($scope.name == "Product") {
      $scope.btnText = "Web Search";
      $scope.details = "https://www.google.co.in/#q="+$stateParams.details;
  } else {
      $scope.btnText = "Open URL";
      $scope.details = $stateParams.details;
  }
  
  //$scope.$apply();
  $scope.openURL = function () {
        window.open($scope.details, '_system');
  };

})

.controller('SettingsCtrl', function($scope) {
  if(localStorage.getItem("SettingData") != null) {
      var settings = [];
      settings = JSON.parse(localStorage.getItem("SettingData"));
      $scope.settings = {
          disableSuccessBeep: settings.disableSuccessBeep,
          disableAnimations: settings.disableAnimations,
          torchOn: settings.torchOn,
          preferFrontCamera: settings.preferFrontCamera
      };
  }
});
