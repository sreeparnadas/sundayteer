app.controller("ManualResultCtrl", function ($scope,$http,$filter,$rootScope,dateFilter,$timeout,$interval,$window) {
    $scope.msg = "This is ManualResultCtrl controller";
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
    $scope.disableSubmitButton= false;

    $scope.x = false;   /*  This variable set for editable manual form  */

   $scope.gameList=[{game_id: 1,game_name: "2 DIGIT"}];


    $scope.getPlaySeries=function () {
        var request = $http({
            method: "get",
            url: api_url+"/getPlaySeries",
            dataType:JSON,
            data: {}
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.seriesList=response.data;            
        });
    };
    $scope.getPlaySeries();


    $scope.getDrawList=function () {
        var request = $http({
            method: "get",
            dataType:JSON,
            url: api_url+"/getAllDrawTimes",
            data: {}
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.timeList=response.data;
        });
    };
    $scope.getDrawList();

    $scope.getDigitDrawTime=function () {
        var request = $http({
            method: "get",
            url: api_url+"/getDrawTimeForManualResult",
            dataType:JSON,
            data: {}
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.digitDrawTime=response.data;
            $scope.manualData.time=$scope.digitDrawTime[0];
        });
    };
    $scope.getDigitDrawTime();


    $scope.series_one_val='';$scope.series_two_val='';$scope.series_three_val=''
    $scope.getEditableManual=function () {
        var request = $http({
            method: "get",
            url: api_url+"/getLastInsertedManualResult",
            dataType:JSON,
            data: {}
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.editableResult=response.data;
            // $scope.manualData.aandar = parseInt($scope.editableResult.result / 10);
            $scope.manualData.bahar = $scope.editableResult.result;
        });
    };


    $scope.manualData={time:'',aandar:'',bahar:''};




    $scope.submitManualResult=function(manualResult){
        $scope.disableSubmitButton= true;
        var master={};
        if(manualResult && manualResult.time){
            master.draw_master_id=parseInt(manualResult.time.id);
        }       
        if(typeof manualResult.aandar === 'undefined' || manualResult.aandar==""){
            master.aandar = -1;
        }else if(manualResult.aandar>=0){
            master.aandar = parseInt(manualResult.aandar);
        }else{
            master.aandar = -1;
        }
        


        // if(typeof manualResult.bahar === 'undefined' || manualResult.bahar==""){
        //     master.bahar = -1;
        // }else if(manualResult.bahar>0){
        //     master.bahar = parseInt(manualResult.bahar);
        // }else{
        //     master.bahar = -1;
        // }
     
        if(master.aandar== -1){
            alert('input not valid');
            $scope.disableSubmitButton= false;
            return;
        }
       
        var request = $http({
            method: "post",
            url: api_url+"/saveManualResult",
            dataType:JSON,
            data: {
                master: master
            }
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.manualResultReport=response.data;
            if($scope.manualResultReport.success==1){
                $scope.manualData={};                 
                alert($scope.manualResultReport.message);
                $scope.disableSubmitButton= false;
                var index = $scope.digitDrawTime.findIndex(x=>x.id===master.draw_master_id);
                $scope.digitDrawTime.splice(index,1);
                
            }else{
                alert("Something went wrong");
            }
        });
       
    };



    
    $scope.updateManualResult=function(drawId,manualResult){
        var master={};
        master.draw_master_id=parseInt(drawId);
        if(isNaN(master.draw_master_id)){
            alert("Invalid draw time");return;
        }
        // if(typeof manualResult.aandar === 'undefined' || manualResult.aandar==""){
        //     master.aandar = -1;
        // }else if(manualResult.aandar>=0){
        //     master.aandar = parseInt(manualResult.aandar);
        // }else{
        //     master.aandar = -1;
        // }


        if(typeof manualResult.bahar === 'undefined' || manualResult.bahar==""){
            master.bahar = -1;
        }else if(manualResult.bahar>0){
            master.bahar = parseInt(manualResult.bahar);
        }else{
            master.bahar = -1;
        }
     
        if(master.bahar== -1){
            alert('input not valid');
            return;
        }
       
        var request = $http({
            method: "post",
            url: api_url+"/updateCurrentManual",
            dataType:JSON,
            data: {
                master: master
            }
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.manualUpdateReport=response.data;
           
            if($scope.manualUpdateReport.success==1){
                alert("Updated");                
            }
        });
       
    };


    $scope.labels = ['0', '1', '2', '3', '4', '5', '6','7','8','9'];
    $scope.series = ['Aandar', 'Bahar'];
  
    $scope.data = [
      [65, 59, 80, 81, 56, 55, 40],
      [28, 48, 40, 19, 86, 27, 90]
    ];

    $scope.gameName = null;
    $scope.getInputTotalDrawAndGameWise=function(drawId){
        var request = $http({
            method: "post",
            url: api_url+"/getTotalBoxInput",
            dataType:JSON,
            data: {
                  draw_id: drawId
              }
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          }).then(function(response){
              if(drawId === 1){
                  $scope.gameName = 'F/R';
              }else{
                  $scope.gameName = 'S/R';
              }
              $scope.inputTotalRecord=response.data;
            //   var aandar = $scope.inputTotalRecord.singleInput[0];
            //   var bahar = $scope.inputTotalRecord.singleInput[1];
            //   $scope.data = [[aandar.zero,aandar.one,aandar.two,aandar.three,aandar.four,aandar.five,aandar.six,aandar.seven,aandar.eight,aandar.nine],
            //   [bahar.zero,bahar.one,bahar.two,bahar.three,bahar.four,bahar.five,bahar.six,bahar.seven,bahar.eight,bahar.nine]
            // ];
            
          });
    };    

});

