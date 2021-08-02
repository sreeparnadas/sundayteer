app.controller("ResultCtrl", function ($scope,$http,$filter,$rootScope,dateFilter,$timeout,$interval,$window) {
    $scope.msg = "This is result controller";
    $scope.tab = 1;
    $scope.selectedTab = {
        "color" : "white",
        "background-color" : "coral",
        "font-size" : "15px",
        "padding" : "5px"
    };
    $scope.setTab = function(newTab){
        $scope.tab = newTab;
    };
    $scope.isSet = function(tabNum){
        return $scope.tab === tabNum;
    };


    $scope.start_date=new Date();
    $scope.end_date=new Date();
    
    $scope.changeDateFormat=function(userDate){
        return moment(userDate).format('YYYY-MM-DD');
    };

    $scope.getPlaySeriesList=function(){
        var request = $http({
            method: "get",
            url: api_url+"/getPlaySeries",
            dataType:JSON,
            data: {},
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.seriesList=response.data;
        });
    }; 
    $scope.getPlaySeriesList();
    // get total sale report for 2d game
    $scope.resultData=[];
    $scope.getRow = function(num) {
        return new Array(num);
    }
    
    // $scope.getResultListByDate=function(startDate, endDate){
    //
    //     startDate = $scope.changeDateFormat(startDate);
    //     endDate = $scope.changeDateFormat(endDate);
    //
    //     $scope.previousResultByDate = alasql("select * from ? where game_date>=? and game_date<=?",[$scope.previousResult,startDate,endDate]);
    //
	// 	// var dt=$scope.changeDateFormat(searchDate);
    //     // var request = $http({
    //     //     method: "post",
    //     //     url: api_url+"/getResultsByDate",
    //     //     dataType:JSON,
    //     //     data: {
    //     //     	result_date: dt
    //     //     }
    //     //     ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    //     // }).then(function(response){
    //     //     $scope.resultData=response.data;
    //     //     $scope.resultTableRow = Math.floor(($scope.resultData.length) / 2);
    //     //         if(($scope.resultData.length) % 2){
    //     //             $scope.resultTableRow +=1;
    //     //         }
    //     // });
    // };

    $scope.todayDate = new Date();
    $scope.start_result_date = new Date($scope.todayDate.getFullYear(),$scope.todayDate.getMonth(),$scope.todayDate.getDate()-30);
    $scope.end_result_date = $scope.todayDate;

    $scope.getResultListByDate($scope.start_result_date, $scope.end_result_date);


    // $scope.todayDate = new Date();
    // $scope.start_result_date = new Date($scope.todayDate.getFullYear(),$scope.todayDate.getMonth(),$scope.todayDate.getDate()-20);
    // $scope.end_result_date = $scope.todayDate;

    $scope.getResultListByDate($scope.start_result_date,$scope.end_result_date);
    $scope.message='';
    $scope.submitNewMessage=function(message){
        var request = $http({
            method: "post",
            url: api_url+"/addNewMessage",
            dataType:JSON,
            data: {
                msg: message
            }
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.messageRecord=response.data;
            if($scope.messageRecord.success==1){
            	 $scope.message='';
                $scope.submitStatus=true;
                $timeout(function() {
                    $scope.submitStatus = false;
                }, 5000);
                
            }
        });
       
    };

});

