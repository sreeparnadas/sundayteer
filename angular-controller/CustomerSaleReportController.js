app.controller("CustomerSaleReportCtrl", function ($scope,$http,$filter,$rootScope,dateFilter,$timeout,$interval,$window) {
    $scope.msg = "This is CustomerSaleReport controller";
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

    $scope.grandTotalStyle = {
        "color" : "white",
        "background-color" : "rgb(77 20 169)",
        "font-size": "15px",
    };

    $scope.totalRowStyle = {
        "background-color" : "#94b8b8",
        "font-size": "10px",
    };

    $scope.start_date=new Date();
    $scope.end_date=new Date();
    $scope.barcode_report_date=new Date();
    $scope.changeDateFormat=function(userDate){
        return moment(userDate).format('YYYY-MM-DD');
    };

    $scope.isLoading=false;
    $scope.isLoading2=true;

    // get total sale report for 2d game
    $scope.alertMsg=true;
    $scope.select_terminal=0;
    $scope.select_stockist=0;
    $scope.getAllTerminalTotalSale=function (start_date,end_date,select_stockist,select_terminal) {  
        $scope.saleReport = [];
        $scope.isLoading=true;
        $scope.alertMsg=false;
        var start_date=$scope.changeDateFormat(start_date);
        var end_date=$scope.changeDateFormat(end_date);
        if(start_date > end_date){
            var temp=start_date;
            start_date=end_date;
            end_date=temp;
        }
        var request = $http({
            method: "post",
            url: api_url+"/getTerminalTotalSaleReport",
            dataType:JSON,
            data: {
                start_date: start_date
                ,end_date: end_date
            }
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.saleReport=response.data;
            var stockistId=$scope.users.user_id;
            var personCatTd=$scope.users.user_type_id;
            if(personCatTd===4){
                $scope.saleReport=alasql("SELECT *  from ? where stockist_user_id=?",[$scope.saleReport,stockistId]);
                // var result=alasql('SELECT sum(amount) as total_amount,sum(commision) as total_commision,sum(prize_value) as total_prize_value,sum(net_payable) as total_net_payable  from ? ',[$scope.saleReport]);
                // var lastIndex = $scope.saleReport.length - 1;
                // console.log(lastIndex, result);
                // $scope.saleReport[lastIndex].amount = parseInt(result[0].total_amount);
                // $scope.saleReport[lastIndex].commision = parseInt(result[0].total_commision);
                // $scope.saleReport[lastIndex].prize_value = parseInt(result[0].total_prize_value);
                // $scope.saleReport[lastIndex].net_payable = parseInt(result[0].total_net_payable);

            }else{
                if(select_stockist!==0){
                    $scope.saleReport=alasql("SELECT *  from ? where stockist_user_id=?",[$scope.saleReport,select_stockist]);
                }
            }

            if(select_terminal!==0){
                $scope.saleReport=alasql("SELECT *  from ? where user_id=?",[$scope.saleReport,select_terminal]);
            }
            $scope.isLoading=false;
            
            if($scope.saleReport.length===0){
                $scope.alertMsg=true;
            }else{
                $scope.alertMsg=false;
            }

        });


    };



    $scope.$watch("saleReport", function(newValue, oldValue){

        if(newValue != oldValue){
            var result=alasql('SELECT sum(amount) as total_amount,sum(commision) as total_commision,sum(prize_value) as total_prize_value,sum(net_payable) as total_net_payable  from ? ',[newValue]);
            // $scope.saleReportFooter=result[0];
        }
    });

    


    $scope.gameList = [
        {id : 1, name : "2D"},
    ];
    $scope.select_game=$scope.gameList[0];

    $scope.select_draw_time=0;


    $scope.barcodeType = [
        {id : 1, type : "All barcode"},
        {id : 2, type : "Winning barcode"}
    ];
    $scope.select_barcode_type=$scope.barcodeType[0];


    $scope.showParticulars=function (target) {
        $scope.target=target;
    };

    $scope.claimedBarcodeForPrize=function (barcodeDetails,game_id) {
        var request = $http({
            method: "post",
            dataType:JSON,
            url: api_url+"/insert_claimed_barcode_details",
            data: {
                barcode: barcodeDetails.barcode
                ,game_id:game_id
                ,prize_value:barcodeDetails.prize_value
            }
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.claimReport=response.data;
            if($scope.claimReport.success==1){
                alert("Thanks for the  claim");
                barcodeDetails.is_claimed=1;
            }
        });
    };


    $scope.getTerminalList=function (stId) {
        var request = $http({
            method: "get",
            dataType:JSON,
            url: api_url+"/getAllTerminals",
            data: {}
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.terminalList=response.data;
            var stockistId=$scope.users.id;
            var personCatTd=$scope.users.user_type_id;
            if(personCatTd===4){
                $scope.terminalList=alasql("SELECT *  from ? where stockist_id=?",[$scope.terminalList,stockistId]);
            }else{ 
                if(stId!==0){
                    $scope.terminalList=alasql("SELECT *  from ? where stockist_id=?",[$scope.terminalList,stId]);
                }
            }

        });
    };
    $scope.getTerminalList(0);


    $scope.getStockistList=function () {
        var request = $http({
            method: "get",
            url: api_url+"/getAllStockists",
            dataType:JSON,
            data: {}
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.stockistList=response.data;
        });
    };
    $scope.getStockistList();

    
});

