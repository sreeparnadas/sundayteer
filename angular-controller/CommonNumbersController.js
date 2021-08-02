app.controller("CommonNumbersCtrl", function ($scope,$http,$filter,$rootScope,dateFilter,$timeout,$interval,$window) {
    $scope.msg = "This is CommonNumbers controller";
    
    $scope.getDrawList=function () {
        var request = $http({
            method: "get",
            dataType:JSON,
            url: api_url+"/getAllDrawTimes",
            data: {}
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.drawTimes=response.data;
        });
    };

    $scope.getDrawList();
    
    $scope.commonNumbersArray=[
        {
            draw_master_id:1,house:'',ending:'',direct_one:'',direct_two:''
        },
        {
            draw_master_id:2,house:'',ending:'',direct_one:'',direct_two:''
        }
    ];

    $scope.saveCommonNumbers = function(){
        var request = $http({
            method: "post",
            dataType:JSON,
            url: api_url+"/commonNumbers",
            data: {
                common_numbers: $scope.commonNumbersArray
            }
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.commonNumbersResponse = response.data;            
            var alertTitle = 'Record saved!';
            var alertDescription ="";
            $scope.showAlert(this.ev,alertTitle,alertDescription);
        });
    };

    $scope.getCommonNumbersByCurrentDate=function () {
        var request = $http({
            method: "get",
            dataType:JSON,
            url: api_url+"/commonNumbers",
            data: {}
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            if(response.data.data.length){
                $scope.commonNumbersArray=response.data.data;
            }
        });
    };

    $scope.getCommonNumbersByCurrentDate();
    
});

