app.controller("ReportTerminalCtrl", function ($scope,$http,$filter,$rootScope,dateFilter,$timeout,$interval,$window) {
    $scope.msg = "This is Terminal report controller";
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


    $scope.selectDate=true;
    $scope.winning_date=$filter('date')(new Date(), 'dd.MM.yyyy');
    $scope.start_date=new Date();
    $scope.end_date=new Date();
    $scope.barcode_report_date=new Date();
    $scope.changeDateFormat=function(userDate){
        return moment(userDate).format('YYYY-MM-DD');
    };

    $scope.isLoading=false;
    $scope.isLoading2=false;

    // get total sale report for 2d game
    $scope.alertMsg=true;
    $scope.alertMsg2=true;
    $scope.alertMsgCard=true;
    
    $scope.getNetPayableDetailsByDate=function (start_date,end_date) {
        
        $scope.isLoading=true;
        $scope.alertMsg=false;
        $scope.alertMsg2=true;
        $scope.alertMsgCard=false;
        var start_date=$scope.changeDateFormat(start_date);
        var end_date=$scope.changeDateFormat(end_date);
        if(start_date > end_date) {
            var temp = start_date;
            start_date = end_date;
            end_date = temp;
        }

        var request = $http({
            method: "post",
            url: api_url+"/terminalReportDetails",
            dataType:JSON,
            data: {
                start_date: start_date
                ,end_date: end_date
                ,terminal_id: $scope.users.id
            }
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.saleReport=response.data;
            $scope.isLoading=false;
            if($scope.saleReport.length==0){
                $scope.alertMsg=true;
            }else{
                $scope.alertMsg=false;
            }
        });
    };

    //$scope.getNetPayableDetailsByDate($scope.start_date,$scope.end_date);



    $scope.$watch("saleReport", function(newValue, oldValue){

        if(newValue != oldValue){
            var result=alasql('SELECT sum(amount) as total_amount,sum(commision) as total_commision,sum(winning_bonous) as total_winning_bonous,sum(prize_value) as total_prize_value,sum(net_payable)-sum(winning_bonous) as total_net_payable  from ? ',[newValue]);
            $scope.saleReportFooter=result[0];
        }
    });


    $scope.gameList = [
        {id : 1, name : "2D"},
        {id : 2, name : "Card"}
    ];
    $scope.select_game=$scope.gameList[0];

    // get two digit draw time list
    $scope.getDrawList=function (gameNo) {
        var request = $http({
            method: "get",
            url: api_url+"/getAllDrawTimes",
            dataType:JSON,
            data: {}
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.drawTime=response.data;
            // console.log('getAllDrawTimes',$scope.drawTime);
        });
    };
    $scope.getDrawList($scope.select_game.id);
    $scope.select_draw_time=0;


    $scope.barcodeType = [
        {id : 1, type : "All barcode"},
        {id : 2, type : "Winning barcode"}
    ];
    $scope.select_barcode_type=$scope.barcodeType[0];




    // get terminal report order by barcode
    $scope.showbarcodeReport=[];
    $scope.getAllBarcodeDetailsByDate=function (start_date,end_date,barcode_type,select_draw_time) {

        // console.log('report terminal controller', $scope.users.userId);

        $scope.isLoading2=true;
        var start_date=$scope.changeDateFormat(start_date);
        var end_date=$scope.changeDateFormat(end_date);
        $scope.x=select_draw_time;       
        
        var request = $http({
            method: "post",
            url: api_url+"/barcodeReportFromTerminal",
            dataType:JSON,
            data: {
                terminalId: $scope.users.id
                ,startDate: start_date
                ,endDate: end_date
            }
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.barcodeWiseReport=response.data;            
            if(barcode_type==1){
                $scope.showbarcodeReport = angular.copy($scope.barcodeWiseReport);
            }else{
                var winBarcodeDetails=alasql('SELECT *  from ?  where prize_value > 0',[$scope.barcodeWiseReport]);
                $scope.showbarcodeReport=angular.copy(winBarcodeDetails);
            }      

            if(select_draw_time>0){
                $scope.x=parseInt(select_draw_time);
                $scope.showbarcodeReport=alasql("SELECT *  from ? where draw_master_id=?",[$scope.showbarcodeReport,$scope.x]);
            }
        });

    };



   
    $scope.showParticulars=function (target,barcode) {
        $scope.particularsNote = '';
        $scope.target=target;
        var request = $http({
            method: "post",
            url: api_url+"/getBarcodeInputDetails",
            data: {
                barcode: barcode
            }
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.particularsDetails=response.data;
            $scope.particularsRow = Math.floor(($scope.particularsDetails.length) / 2);
                if(($scope.particularsDetails.length) % 2){
                    $scope.particularsRow +=1;
                }
            $scope.particularsDetails.forEach(function (val, idx) {
                $scope.particularsNote += val.series_name + ' ' + val.particulars;
            });  
            $scope.showbarcodeReport[target].particulars = $scope.particularsNote;          
        });
    };

    $scope.claimedBarcodeForPrize=function (barcodeDetails,game_id) {
        var request = $http({
            method: "post",
            dataType:JSON,
            url: api_url+"/claimBarcodeManually",
            data: {
                playMasterId: barcodeDetails.play_master_id
                ,gameId:game_id
                ,prizeValue:barcodeDetails.prize_value
                ,terminalId : $scope.users.userId
            }
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.claimReport=response.data;
            var idx = $scope.barcodeWiseReport.findIndex( record => record.play_master_id === barcodeDetails.play_master_id);
            $scope.barcodeWiseReport[idx].is_claimed = $scope.claimReport.is_claimed;
            $scope.barcodeWiseReport[idx].claimed = 'yes';
            if($scope.claimReport.success==1){
                alert("Thanks for the  claim");
                barcodeDetails.is_claimed=1;
            }
        });
    };

    $scope.cancelTicketBeforeDrawClosed=function(cancelTicketId, index){
        var request = $http({
            method: "patch",
            dataType:JSON,
            url: api_url+"/cancelTicket",
            data: {
                ticketId:  cancelTicketId
            }
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.record=response.data
            var alertTitle = $scope.record.msg;
            var alertDescription ="";
            $scope.showAlert(this.ev,alertTitle,alertDescription);
            if($scope.record.success==1){
                $scope.showbarcodeReport[index].is_cancelled = 1;
            }
            
        });
    };


});

