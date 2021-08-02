app.controller("HelpTerminalCtrl", function ($scope,$http,$filter,$rootScope,dateFilter,$timeout,$interval,$window) {
    $scope.msg = "This is help terminal controller";
    $scope.tab = 1;

    $scope.setTab = function(newTab){
        $scope.tab = newTab;
    };
    $scope.isSet = function(tabNum){
        return $scope.tab === tabNum;
    };

    $scope.selectedTab = {
        "color" : "white",
        "background-color" : "coral",
        "font-size" : "15px",
        "padding" : "5px"
    };


      $scope.getTerminalList=function () {
        var request = $http({
            method: "get",
            url: api_url+"/getAllTerminals",
            dataType:JSON,
            data: {}
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.terminalList=response.data;
        });
    };
    $scope.getTerminalList();


    
    $scope.getTime=function () {
        var request = $http({
            method: "get",
            url: api_url+"/selectMissedOutDrawTime",
            dataType:JSON,
            data: {}
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.timeList=response.data;
        });
    };
    $scope.getTime();    
});

