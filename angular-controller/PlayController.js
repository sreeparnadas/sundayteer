app.controller('PlayController', function($cookies,$scope,$rootScope,md5,$mdDialog,$timeout,toaster,$http,$interval,$q,RegistrationService,ParticipantService,$window,proofService,localStorageService,authFact) {

    // console.log($window.location.href);

    $scope.msg = "This is play controller";
    $scope.disableSubmitButton=false;
    $scope.displayReport = false;
    $scope.showTerminalReport=function(visibility){
        $scope.displayReport = visibility;
    }
    $scope.example14dataSelected = [];
    
    $scope.row=10;
    $scope.coloumn=11;
    $scope.getRow = function(num) {
        return new Array(num);
    }

    $scope.getCol = function(num) {
        return new Array(num);
    }
    $scope.getNumber = function(num) {
        return new Array(num);
    };

    $scope.playInput={};
    $scope.defaultPlayInput={0:{},1:{},2:{},3:{},4:{},5:{},6:{},7:{},8:{},9:{}};
    $scope.playInput={0:{},1:{},2:{},3:{},4:{},5:{},6:{},7:{},8:{},9:{}};
    $scope.lpValue = {lp:''};

    $scope.secondLast = [];
    $scope.last = [];

    $scope.selectedGame =1; //jodi = 1, single = 2
    $scope.rollUpResult = true;
    $scope.generateTableRow=function(){
        var r=Math.floor((Math.random()*9)+1);
        return r;
    };
    $scope.generateTableColumn=function(){
        var cl=Math.floor((Math.random()*9)+1);
        return cl;
    };
    $scope.generateNumberByLp=function(lpValue){
        $scope.playInput=[{},{},{},{},{},{},{},{},{},{}];
        $scope.sum=0;
        var lpValue=parseInt(lpValue);
        var min=(lpValue/100);
        if(min<1){
            min=1;
        }
        var max=min+5;
        var range=(max-min)+1;
        if(lpValue==undefined){
            return 0;
        }
        do{
            var row=$scope.generateTableRow();
            var col=$scope.generateTableColumn();
            $scope.lastSum=$scope.sum;
            if($scope.lastSum==lpValue){
                $scope.sum=0;
                return;
            }
            //$scope.playInput[row][col]=Math.floor((Math.random()*range)+1);
            if($scope.playInput[row][col]==undefined){
                $scope.playInput[row][col]=Math.floor((Math.random()*range)+min);
                $scope.sum=$scope.sum+$scope.playInput[row][col];
            }
            //alert($scope.sum);
        }while($scope.sum<lpValue);
        if($scope.sum>lpValue){
            $scope.playInput[row][col]=lpValue-$scope.lastSum;
        }

    };

    
    $scope.verticallyHorizontallyPushValue=function(rowIndex,colIndex){
        if($scope.playInput[rowIndex][colIndex]!=undefined){
            if(rowIndex==10 && colIndex!=10) {
                for(i=0;i<10;i++){
                    $scope.playInput[i][colIndex]=$scope.playInput[rowIndex][colIndex];
                }
            }
            if(colIndex==10 && rowIndex!=10) {
                for(i=0;i<10;i++){
                    $scope.playInput[rowIndex][i]=$scope.playInput[rowIndex][colIndex];
                }
            }
        }
    };


    $scope.getAllSeriesName = function(){
        $http({
            method: 'GET',
            url: api_url+"/getPlaySeries",
            dataType:JSON,
            data: {},
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response){
            $scope.allSeriesList = response.data;
        });
    };
    $scope.getAllSeriesName();

    $scope.getLastDrawresult = function(){
        $scope.rollUpResult = true;
        $http({
            method: 'GET',
            url: api_url+"/getPreviousResult",
            dataType:JSON,
            data: {},
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response){
            $scope.winningValue = response.data;
            if($scope.winningValue!=null){
                $timeout(function(){
                    $scope.rollUpResult = false;
                },10000);
            }
        });
    };
    $scope.getLastDrawresult();

    $scope.resultBydate = [];
    $scope.result_date = $scope.changeDateFormat(new Date());

    $scope.getResultByDate = function(searchDate){
        var dt=$scope.changeDateFormat(searchDate);
        $http({
            method: 'post',
            url: api_url+"/getResultsByDate",
            dataType:JSON,
            data: {
                result_date: dt
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response){
            $scope.resultBydate = response.data;
            $scope.resultTableRow = Math.floor(($scope.resultBydate.length) / 2);
                if(($scope.resultBydate.length) % 2){
                    $scope.resultTableRow +=1;
                }
        });
    };
    $scope.getResultByDate($scope.result_date);





    $scope.resultSummaryByYearMonth=function(select_game,select_year,select_month){
        $scope.d = new Date(select_year, select_month, 0).getDate();
        return;
        var request = $http({
            method: "POST",
            url: site_url+"/Play/getResultSummary",
            data: {
                game: select_game
                ,year: select_year
                ,month: select_month
            }
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.summary_data=response.data;
            $scope.datelist = $scope.summary_data.date_list;
            $scope.summaryData = $scope.summary_data.data;
        });

    };





    $scope.getScrollingMessage = function(){
        $http({
            method: 'GET',
            url: api_url+"/getMessage",
            dataType:JSON,
            data: {},
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response){
            $scope.scrollingMsg = response.data;
        });
    };
    $scope.getScrollingMessage();

    $scope.generatingNewResult =false;
    $scope.counter = '';
    $scope.getNewDraw = function(){
        $http({
            method: 'GET',
            url: api_url+"/getNextDrawNumber",
            dataType:JSON,
            data: {},
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response){
            $scope.counter = response.data.next_draw_id;
        });
    };
    $scope.getNewDraw();
    $interval(function () {
        $scope.getNewDraw();  

    },5000);
    $scope.$watch("counter", function() {
        if($scope.counter != undefined){
            $scope.getCurrentDrawTime();
            $scope.getLastDrawresult();
            $scope.generatingNewResult =true;
            
            $timeout(function(){
                if($scope.hour!=undefined && $scope.minute!=undefined && $scope.second!=undefined){
                    
                    if($scope.hour==$scope.drawTimeObj.hour && $scope.minute==$scope.drawTimeObj.minute && $scope.second<=30){
                        var timeOutCounter = (30-$scope.holasec)*1000;
                        $timeout(function(){
                            $scope.generatingNewResult =false;
                            $scope.getResultOfToday();
                        },timeOutCounter);
            
                    }else{
                       $scope.generatingNewResult =false;
                    }
                }
            },3000);
        }
    }, true);

    $scope.seriesOne = [];
    $scope.seriesTwo =[];
    $scope.seriesThree = [];
    $scope.ticketPrice=0.00;


    $scope.clearInputBox=function(){
        if($scope.selectedGame == 1){
            $scope.playInput = angular.copy($scope.defaultPlayInput);
            $scope.lpValue = {lp:''};
        }else if($scope.selectedGame == 2){
            $scope.secondLast = [];
            $scope.last = [];
        }
       
    };
    $scope.totalBoxSum1 = 0;
    $scope.totalBoxSum2 = 0;
    $scope.totalBoxSum3 = 0;
    $scope.sumOfBox = 0;

    $scope.totalTicketBuy1 = 0;
    $scope.totalTicketBuy2 = 0;
    $scope.totalTicketBuy3 = 0;
    $scope.sumOfTicketPurchased = 0;

  
    $scope.getTotalBuyTicket=function(){
        var mrp=0;
        var sum=0;
        
        if($scope.selectedGame==1){
            // jodi
            if(angular.isArray($scope.allSeriesList)){
                $scope.ticketPrice = $scope.allSeriesList[0].mrp;
            }
            if($scope.playInput!= undefined){
                for(var row=0;row<10;row++){
                    for(var col=0;col<10;col++){
                        if($scope.playInput[row][col]!=undefined){
                            sum=sum+parseInt($scope.playInput[row][col]);
                        }
                    }
                }
            }      

            $scope.totalBoxSum=sum;
            $scope.totalTicketBuy=$scope.totalBoxSum * $scope.ticketPrice;

        }else if($scope.selectedGame==2){
            // single
            if(angular.isArray($scope.allSeriesList)){
                $scope.ticketPrice = $scope.allSeriesList[1].mrp;
            }
            var valOne = 0;
            var valTwo = 0;
            for(var i=0;i<10;i++){
                valOne = parseInt($scope.secondLast[i]);
                valTwo = parseInt($scope.last[i]);
                if(!isNaN(valOne)){
                    sum= sum + valOne;
                }
                if(!isNaN(valTwo)){
                    sum= sum + valTwo;
                }               
            }
            $scope.totalBoxSum=sum;
            $scope.totalTicketBuy=$scope.totalBoxSum * $scope.ticketPrice;
            console.log('selected game 2');
        }
        
    };  

    $scope.$watch('playInput', $scope.getTotalBuyTicket, true);
    $scope.$watch('secondLast', $scope.getTotalBuyTicket, true);
    $scope.$watch('last', $scope.getTotalBuyTicket, true);


    $scope.allowPrint = false;
    $scope.slip_no = null;

    // $scope.setSlipNumber = function(data){
    //     // console.log('function working',test);
    //     $scope.slip_no = data;
    // }

    $scope.submitGameValues=function () {
        $scope.disableSubmitButton = true;
        var user_id = $scope.users.id;
        if($scope.drawTimeList!= undefined){
            var drawId  = $scope.drawTimeList.id;
        }else{
            $scope.showAlert(this.ev,'Draw time missing','');
            $scope.disableSubmitButton = false;
            return;
        }
        if(!$scope.users.user_id){
            var alertTitle = 'Please login';
            var alertDescription ="";
            $scope.showAlert(this.ev,alertTitle,alertDescription);
            $scope.disableSubmitButton = false;
            return;
        }
        if($scope.slip_no === null){
            var alertTitle = 'Please enter slip number';
            var alertDescription ="";
            $scope.showAlert(this.ev,alertTitle,alertDescription);
            $scope.disableSubmitButton = false;
            return;
        }
        var masterData=[];
        if($scope.selectedGame === 1){
            for(var i=0;i<10;i++){
                for(var j=0;j<10;j++){
                    if($scope.playInput[i][j]!=undefined){
                        masterData.push({ "row_num": i, "col_num": j, "val_one": 0, "val_two": 0, "game_value": $scope.playInput[i][j], "play_series_id" : $scope.allSeriesList[0].id});
                    }
                }
            }
        }else if($scope.selectedGame === 2){
            var valOne=0,valTwo=0,row,col;
            for(var i=0;i<10;i++){
                row = i;col = i;
                valOne = parseInt($scope.secondLast[i]);
                valTwo = parseInt($scope.last[i]);
                if(isNaN(valOne)){
                    valOne=0;
                }
                if(isNaN(valTwo)){
                    valTwo=0;
                }
                if(valOne>0 || valTwo>0){
                    masterData.push({ "row_num": row,"col_num": col,"val_one": valOne, "val_two": valTwo, "game_value": valOne+valTwo, "play_series_id" : $scope.allSeriesList[1].id});
                }                   
            }
        }
        // console.log('selected game crossed');
        
        if(masterData.length == 0){
            // console.log('masterData');
            var alertTitle = 'Input is not valid';
            var alertDescription ="";
            console.log('error on masterData');
            $scope.showAlert(this.ev,alertTitle,alertDescription);
            $scope.disableSubmitButton = false;
            return;
        }

        if($scope.example14dataSelected.length === 0){
            var alertTitle = 'Please select F/R or S/R';
            var alertDescription ="";
            $scope.showAlert(this.ev,alertTitle,alertDescription);
            $scope.disableSubmitButton = false;
            return;
        }

        var balance=$scope.loggedInTerminalBalance.current_balance;
        
        var purchasedTicket=$rootScope.roundNumber($scope.totalTicketBuy,2);
       
        if(purchasedTicket > balance) {
            var alertTitle = 'Sorry account balance is low';
            var alertDescription ="";
            $scope.showAlert(this.ev,alertTitle,alertDescription);
            $scope.disableSubmitButton = false;
            return;
        }
        
        var request = $http({
            method: 'POST',
            url: api_url+"/saveGameInputDetails",
            dataType:JSON,
            data: {
                user_id: user_id,
                slip_no: $scope.slip_no,
                playDetails: masterData
                ,drawId: $scope.example14dataSelected
                ,purchasedTicket: purchasedTicket
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.reportArray = response.data;
            $scope.inputDetails = masterData;
            $scope.totalPoint = purchasedTicket;
            $scope.inputItemRow = Math.floor(($scope.inputDetails.length) / 3);
            if(($scope.inputDetails.length) % 3){
                $scope.inputItemRow +=1;
            }
            if($scope.reportArray.success == 1){
                if($scope.allowPrint){
                    $timeout(function() {
                        $rootScope.huiPrintDiv('receipt-div','test_style.css',1);
                     }, 1000);
                }
                else{
                    $scope.showAlert(this.ev,"Ticket purchased!",'');
                    $scope.slip_no = null;
                }
                // $rootScope.huiPrintDiv('receipt-div','',1);
                // $scope.showAlert(this.ev,"Print done",'');
                $scope.loginDetails.StockistToTerminal.current_balance = $scope.reportArray.current_balance;
                localStorageService.remove('loginData');
                localStorageService.set('loginData', $scope.loginDetails);
                $scope.clearInputBox();
                $scope.disableSubmitButton=false;
            }
        });
    };

    
$( document ).ready(function() {
    $('.sm-div').keyup(function (e) {
        if (e.which == 39) { // right arrow
          $(this).closest('td').next().find('input').focus();
 
        } else if (e.which == 37) { // left arrow
          $(this).closest('td').prev().find('input').focus();
 
        } else if (e.which == 40) { // down arrow
          $(this).closest('tr').next().find('td:eq(' + $(this).closest('td').index() + ')').find('input').focus();
 
        } else if (e.which == 38) { // up arrow
          $(this).closest('tr').prev().find('td:eq(' + $(this).closest('td').index() + ')').find('input').focus();
        }
      });
});

});
