app.controller('MainController', function($cookies,$scope,$mdDialog,$timeout,$interval,toaster,$http,UserService,$q,RegistrationService,ParticipantService,$window,proofService,localStorageService,$rootScope,$auth,authFact) {

    //for showing developer area, creating a developer mode object
    $scope.title="ShillongLuckyTeer";
    $scope.showReport=false;
    $scope.developerMode={};
    $scope.developerMode.isEnabled=true;
    $scope.developerMode.isDeveloperDivShowable=$scope.developerMode.isEnabled;
    $scope.loginData = {};
    $scope.loggedInTerminalBalance = {};

    $scope.defaultLoginDetails={
        StockistToTerminal: {},
        data:{
            token: '',
            user:{
                id:'',user_id:'', user_name:'',
                user_type: {
                    type_id: 0,type_name:''
                }
            }
        },
        message:'',
        success:0
    };
    $scope.loginDetails = $scope.defaultLoginDetails;
    $scope.setUserData = function(data){
        $scope.users.user_name = data.user_name;
        $scope.users.user_type_id = data.user_type.type_id;
        $scope.users.id = data.id;
        $scope.users.user_id = data.user_id;
    };

    $scope.unsetUserData = function(){
        $auth.removeToken();
        $scope.users.user_name="";
        $scope.users.user_type_id=0;
        $scope.users.user_id=0;
        $scope.users.id=0;

        $scope.loginDetails = $scope.defaultLoginDetails;
        localStorageService.set('loginData', null);
        $window.location.href = '#!/usercounter';
    };

    $scope.changeDateFormat=function(userDate){
        return moment(userDate).format('YYYY-MM-DD');
    };
    $scope.onTextClick = function ($event) {
        $event.target.select();
    };

    
    $scope.getActiveTerminalBalance = function(terminalId){
        $http({
            method: 'post',
            url: api_url+"/getTerminalBalance",
            dataType:JSON,
            data: {
                terminal_id: terminalId
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response){
            $scope.loggedInTerminalBalance = response.data;
        });
    };

    $scope.previousResult = {};
    $scope.getResult = function(terminalId){
        $http({
            method: 'GET',
            url: api_url+"/getPreviousResult",
            dataType:JSON,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response){
            $scope.previousResult = response.data.data;
        });
    };
    $scope.getResult();

    $scope.entrant_image_url=entrant_image_url;
    $http.defaults.headers.common['uuid']= "asdfasdfasdfasdfasdfass";

    //using local storage
     $scope.users={};
     // $scope.users.person_name=$scope.loginDetails.person.people_name || '';
     // $scope.users.uuid=$scope.loginDetails.person.uuid || '';
     // $scope.users.person_category_id=$scope.loginDetails.person.person_category_id || 0;
     // $scope.users.userID=$scope.loginDetails.person.id || 0;
     // $scope.users.userLoginid = $scope.loginDetails.person.user_id || '';

    // $scope.users.person_name=$scope.loginDetails.data.userName || '';
    // $scope.users.user_type_id = $scope.loginDetails.data.userType.typeID || 0;
    // $scope.users.userID = $scope.loginDetails.ID || 0;
    // $scope.users.userLoginid= $scope.loginDetails.userID || '';

     // console.log('login details', $scope.loginDetails);
     // console.log(localStorageService.get('loginData'));
     if(localStorageService.get('loginData')){
         $scope.loginDetails = localStorageService.get('loginData').data;
         // console.log($scope.loginDetails);
         $scope.users.user_name=$scope.loginDetails.user.user_name || '';
         $scope.users.user_type_id = $scope.loginDetails.user.user_type.type_id || 0;
         $scope.users.id = $scope.loginDetails.user.id || 0;
         $scope.users.user_id= $scope.loginDetails.user.user_id || '';
         $auth.setToken($scope.loginDetails.token);
         authFact.setAccessToken($scope.loginDetails.token);
     }

     /********************************************* */
     
    $scope.commonNumbers=null;
    $scope.getCommonNumbersByCurrentDate=function () {
        var request = $http({
            method: "get",
            dataType:JSON,
            url: api_url+"/commonNumbers",
            data: {}
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.commonNumbers=response.data.data;
        });
    };

    $scope.getCommonNumbersByCurrentDate();


     try {
        $scope.loginDetails=localStorageService.get('loginData') || $scope.loginDetails;
        if($scope.loginDetails.isLoggedIn){
            authFact.setAccessToken($scope.token);
            $scope.setUserData($scope.loginDetails);
        }
        // if($scope.loginDetails.isLoggedIn && $scope.loginDetails.person.person_category_id == 3){
        //     $window.location.href = base_url + '#!/usercounter';
        //     $scope.getActiveTerminalBalance($scope.loginDetails.person.id);
        // }
        // else if($scope.loginDetails.isLoggedIn && $scope.loginDetails.person.person_category_id == 4){
        //     $window.location.href = base_url + '#!/stockistPanel';
        // }else if($scope.loginDetails.isLoggedIn && $scope.loginDetails.person.person_category_id == 1){
        //     $window.location.href = base_url + '#!/admin';
        // }
        // else{
        //     $window.location.href = base_url + '#!';
        // }
      }
      catch(err) {
        console.log("Error: " + err + ".");
      }

    //function for getting current draw
    $scope.isAuthenticated =false;
    // $rootScope.checkAuthentication=function(){
    //     $scope.loginDetails=localStorageService.get('loginData') || $scope.loginDetails;
    //     var isLoggedIn = $scope.loginDetails.isLoggedIn;
    //     var userData = $scope.loginDetails.person;
    //     if(isLoggedIn==false && Object.keys(userData).length==0){
    //         $window.location.href = base_url + '#!';
    //     }else if(isLoggedIn==true && userData.person_category_id==3){
    //         $window.location.href = base_url + '#!';
    //     }
    // };

    $scope.getCurrentDrawTime = function(){
        $http({
            method: 'GET',
            url: api_url+"/getActiveDraw",
            dataType:JSON,
            data: {},
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response){
            $scope.drawTimeList = response.data;
            $scope.drawTimeObj = {};

            // CONVERT DRAW TIME TO MILLISECOND//
            $scope.dateArray = $scope.drawTimeList.end_time.split(":");
            $scope.myDate = new Date(1970, 0, 1, $scope.dateArray[0], $scope.dateArray[1], $scope.dateArray[2]);
            $scope.drawTimeObj.hour=$scope.myDate.getHours();
            $scope.drawTimeObj.minute=$scope.myDate.getMinutes();
            $scope.drawTimeObj.second=$scope.myDate.getSeconds();
        });
    };

    $scope.leftHour = 0;
    $scope.leftMinute = 0;
    $scope.leftsecond = 0;
    $scope.getLeftTimeForTheNextDraw = function(drawTimeObj,currentTimeObj){
        var h1,h2,m1,m2,s1,s2;
        h2 = drawTimeObj.hour;
        m2 = drawTimeObj.minute;
        s2 = drawTimeObj.second;

        h1 = currentTimeObj.hour;
        m1 = currentTimeObj.minute;
        s1 = currentTimeObj.second;
        if(s2 < s1){
            s2 = s2 + 60;
            m2 = m2 - 1;
        }
        if(m2 < m1){
            m2 = m2 + 60;
            h2 = h2 - 1;
        }
        if(h1 > h2){
            $scope.leftHour = (24 - h1) + h2;
        }else{
            $scope.leftHour = h2 - h1;
        }
        $scope.leftMinute = m2 - m1;
        $scope.leftsecond = s2 - s1;
    }
    //function for generating UUID

    $scope.GenerateUUID=function(tempID){
        var x=JSON.stringify({id:tempID,person_name:'abcd',mobile1:9854785698})
        $scope.testNew = $q.defer();
        $.ajax({
            type: "POST",
            url: api_url+"/generateToken",
            data: x,
            async:true,
            crossDomain: true,
            contentType: "json",
            headers: {'Content-Type': 'application/json','crossorigin':'anonymous' },
            processData: false,
            success:function(response) {
                $scope.testNew.resolve(response);
            }
        });
        $scope.testNew.promise.then(function(response){
            // $scope.imageUploadStatus = response.list;

        });
    };


    //function for validating  a user after login
    // console.log('localData Storage',localStorageService.get('loginData'));
    // console.log('loginDetails',$scope.loginDetails );
    // $auth.setToken($scope.loginDetails.token);
    // authFact.setAccessToken($scope.loginDetails.token);
    $scope.validateUser = function(){
        $scope.loginDefer = $q.defer(); // This also creates an instance of promise
        //$scope.publish(); // This is our async function call

        $http({
            method: 'POST',
            url: api_url+"/login",
            dataType: 'json',
            data: $scope.loginData,
        }).then(function (response){
            if(response.data.success==true){
                $scope.loginDefer.resolve(response.data);
                $scope.loginError="";
            }else{
                toaster.pop('warning',response.data.msg);
                $scope.users.id= 0 ;
                $scope.users.user_name="";
                $scope.users.user_type_id = 0;
                $scope.users.user_id = 0;
                localStorageService.set('loginData', ' ');
            }
        },function (error){

        });
        $scope.loginDefer.promise.then(function(data){
            localStorageService.set('loginData', data);
            $scope.setUserData(data.data.user);
            $scope.loginDetails=data;
            $scope.token = data.data.token;
            $auth.setToken($scope.token);
            authFact.setAccessToken($scope.token);
            // $scope.getActiveTerminalBalance($scope.loginDetails.person.id);
            if($scope.loginDetails.data.user.user_type.type_id === 1) {
                $window.location.href = base_url + '#!/admin';
            }else if($scope.loginDetails.data.user.user_type.type_id === 3){
                $window.location.href = base_url + '#!/usercounter';
            }else if($scope.loginDetails.data.user.user_type.type_id === 4) {
                $window.location.href = base_url + '#!/stockistPanel';
            }
            toaster.pop('success',data.msg,' Welcome '+ $scope.loginDetails.data.user.user_name);
        });
    };

    $scope.popSuccess = function(msgTitle,msgText){
        toaster.pop('success', msgTitle, msgText);
    };
    $scope.popError = function(msgTitle,msgText){
        toaster.pop('error', msgTitle, msgText);
    };
    $scope.popWarning = function(msgTitle, msgText){
        toaster.pop('warning', msgTitle, msgText);
    };
    $scope.popNote = function(msgTitle, msgText){
        toaster.pop('note', msgTitle, msgText);
    };

    /****** test function ***********/

    /****** ***********/
    $scope.loginUser = function(event) {
        $mdDialog.show ({
            clickOutsideToClose: true,
            scope: $scope,
            preserveScope: true,
            templateUrl: 'md_dialog_template/login_user.html',

            controller: function DialogController($scope, $mdDialog) {
                $scope.closeDialog = function() {
                    $mdDialog.hide();
                }
            }
        });
    };

    $scope.logoutUserWithConfirmation = function(event) {
        // console.log(localStorageService.get('loginData').data.token.split('|')[0]);
        // return;

        // localStorageService.remove('loginData');
        var confirm = $mdDialog.confirm()
            .title('Are you sure to Logout?')
            .textContent('Record will be deleted permanently.')
            .ariaLabel('Sukanta Hui')
            .targetEvent(event)
            .ok('Yes')
            .cancel('No');
        $mdDialog.show(confirm).then(function() {
            $scope.loginDetails = null;

            var request = $http({
                method: 'POST',
                url: api_url+"/logout",
                dataType:JSON,
                data: {
                    uid: $scope.users.id,
                    userCategoryId: $scope.users.user_type_id,
                    token_id: localStorageService.get('loginData').data.token
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function(response){
                $scope.showReport=false;
                $scope.unsetUserData();                
                authFact.unsetAccessToken();
                localStorageService.remove('loginData');
             });
          
        }, function() {
            //not to Logout
        });
    };

    // Get game starting date
    $scope.today = new Date();
    $scope.dd = new Date().getDate();
    $scope.mm = new Date().getMonth()+1;
    $scope.yy = new Date().getFullYear();
    $scope.day= ($scope.dd<10)? '0'+$scope.dd : $scope.dd;
    $scope.month= ($scope.mm<10)? '0'+$scope.mm : $scope.mm;
    $scope.gameStartingDate=($scope.day+"/"+$scope.month+"/"+$scope.yy);
    // End of game starting date

    $scope.getTimeinIstZone = function(){
        $scope.getCurrentDrawTime();
        $http({
            method: 'GET',
            url: api_url+"/getServerTime",
            dataType:JSON,
            data: {},
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response){
            var timeDetailsObj = response.data;
            var test = new Date(timeDetailsObj.timeInMilliSeconds);
            $scope.currentDateTime = timeDetailsObj.dateTime;
            $scope.currentTime = timeDetailsObj.time;
            $scope.timeInArray = $scope.currentTime.split(':');
            $scope.hour = $scope.timeInArray[0];
            $scope.minute = $scope.timeInArray[1];
            $scope.second = $scope.timeInArray[2];
            $interval(function () { 
                $scope.currentTimeObj = {};
                if ($scope.hour == 23 && $scope.minute ==59 && $scope.second>58)   {
                    $scope.hour = 0;
                    $scope.minute = 0;
                    $scope.second = 1;
                }
                if($scope.second > 58 && $scope.minute == 59){
                    $scope.minute = 0;
                    $scope.second = 1;
                    $scope.hour++;
                    if($scope.hour ==24){
                        $scope.hour = 0;
                    }
                }else if($scope.second > 58){
                    $scope.second = 0;
                    $scope.minute++;
                }else{
                    $scope.second++;
                }
                $scope.currentTimeObj.hour = $scope.hour;
                $scope.currentTimeObj.minute = $scope.minute;
                $scope.currentTimeObj.second = $scope.second;
                if($scope.drawTimeObj != undefined){
                    $scope.getLeftTimeForTheNextDraw($scope.drawTimeObj,$scope.currentTimeObj);
                }
                
            },1000);
        },function (error){

        });
    };
    $scope.getTimeinIstZone();

    $scope.todayDate = new Date();
    $scope.start_result_date = new Date($scope.todayDate.getFullYear(),$scope.todayDate.getMonth(),$scope.todayDate.getDate()-20);
    $scope.end_result_date = $scope.todayDate;


    $scope.showReport = false;

    $scope.previousResultByDate = null;

    $scope.getResultListByDate=function(startDate, endDate){

        startDate = $scope.changeDateFormat(startDate);
        endDate = $scope.changeDateFormat(endDate);

        // $scope.previousResultByDate = alasql("select * from ? where game_date>=? and game_date<=?",[$scope.previousResult,startDate,endDate]);
        // console.log($scope.previousResultByDate);

            var request = $http({
                method: "post",
                url: api_url+"/getPreviousResultByDate",
                dataType:JSON,
                data: {
                    start_date: startDate,
                    end_date: endDate
                }
                ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function(response){
                console.log(response.data);
                $scope.previousResultByDate = response.data;

            });

    };

    $scope.todayDate = new Date();
    $scope.previous_result_start_result_date = new Date($scope.todayDate.getFullYear(),$scope.todayDate.getMonth(),$scope.todayDate.getDate()-30);
    $scope.previous_result_end_result_date = $scope.todayDate;

    $scope.getResultListByDate($scope.start_result_date, $scope.end_result_date);
    


    $scope.showAlert = function(ev,alertTitle,alertDescription) {
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title(alertTitle)
            .textContent(alertDescription)
            .ariaLabel('Alert Dialog Demo')
            .ok('Okay!')
            .targetEvent(ev)
        );
    };


    $scope.filterValue = function($event){
        if(isNaN(String.fromCharCode($event.keyCode))){
            $event.preventDefault();
        }

        if($event.keyCode == 32 || $event.keyCode == 48){
            $event.preventDefault();    /*check whitespace abd zero*/
        }
    };

    $scope.findObjectByKey = function(array, key, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][key] === value) {
                return array[i];
            }
        }
        return null;
    };


    $scope.todayResult = [];
    $scope.getResultOfToday = function(){
        $http({
            method: 'get',
            url: api_url+"/getTodayResult",
            dataType:JSON,
            data: {},
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response){
            $scope.todayResult = response.data;
        });
    };
    $scope.getResultOfToday();

    $scope.getAdvanceDrawTime = function(){
        $scope.advanceDrawTimeList = [];
        $http({
            method: 'GET',
            url: api_url+"/getAdvanceDraws",
            dataType:JSON,
            data: {},
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response){
            $scope.advanceDrawTimeList = response.data;
        });
    };
    $scope.getAdvanceDrawTime();

    $scope.showCommonNumbers = false;
    $scope.highlightCommonNumberDiv = function(){
        $scope.showCommonNumbers = true;
        $('#highlight').addClass('bordered-div');
        $timeout(function() {
            $('#highlight').removeClass('bordered-div');
        }, 60000);
    };


    $scope.name = 'World';

  $scope.example14model = [];
  $scope.setting1 = {
      scrollableHeight: '200px',
      scrollable: true,
      enableSearch: true
  };
  
      $scope.setting2 = {
      scrollableHeight: '200px',
      scrollable: true,
      enableSearch: false
  };
  
  $scope.example14data = [{
      "label": "F/R",
          "id": "1"
  }, {
      "label": "S/R",
          "id": "2"
  }];
  $scope.example2settings = {
      displayProp: 'id'
  };


  $interval(function () {
    // $scope.getNewDraw();

    },5000);

    $scope.previousRecordsList= [];
    $scope.showPreviousResults=function(){
    	
        $http({
            method: 'GET',
            url: api_url+"/getPreviousResult",
            dataType:JSON,
            data: {},
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response){
            $scope.previousRecordsList = response.data
        });
	};
    $scope.showPreviousResults();

});
