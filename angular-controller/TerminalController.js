app.controller("TerminalCtrl", function ($scope,$http,$filter,$rootScope,dateFilter,$timeout,$interval,$window,$mdDialog) {
    $scope.msg = "This is terminal controller";
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


    
    // get all terminal list

    var request = $http({
        method: "get",
        url: api_url+"/getAllTerminals",
        dataType:JSON,
        data: {}
        ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then(function(response){
        $scope.terminalList=response.data;
        var stockistId=$scope.users.id;
        var personCatTd=$scope.users.user_type_id;
        if(personCatTd===4){
            $scope.terminalList=alasql("SELECT *  from ? where stockist_id=?",[$scope.terminalList,stockistId]);
        }
    });




    $scope.saveTerminalData=function (terminal) {
        var master=angular.copy(terminal);
        master.stockist=terminal.stockist.id;
        var stockist_sl_no= terminal.stockist.serial_number;
        var stockist_id= terminal.stockist.id;
        var request = $http({
            method: "post",
            url: api_url+"/saveNewTerminal",
            dataType:JSON,
            data: {
                terminal: master
                ,stockist_sl_no: stockist_sl_no
                ,stockist_id: stockist_id
            }
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.terminalReport=response.data;
            if($scope.terminalReport.success==1){
                $scope.updateableTerminalIndex=0;
                $scope.submitStatus = true;
                $scope.isUpdateable=true;
                $timeout(function() {
                    $scope.submitStatus = false;
                }, 4000);

                $scope.terminal.terminal_id = $scope.terminalReport.terminal_id;
                var tempTerminal={};
                tempTerminal.terminal_id=$scope.terminalReport.terminal_id;
                tempTerminal.stockist_id=$scope.terminal.stockist.id;
                tempTerminal.stockist_name=$scope.terminal.stockist.stockist_name;
                tempTerminal.user_name=$scope.terminal.user_name;
                tempTerminal.user_id=$scope.terminal.user_id;
                tempTerminal.pin=$scope.terminal.user_password;
                $scope.terminalList.unshift(tempTerminal);
                $scope.terminalForm.$setPristine();
            }

        });
    };

    $scope.defaultTerminal={
        person_name: ""
        ,user_id: ""
        ,user_password: ""
    };
    $scope.terminal=$scope.defaultTerminal;
    $scope.randomPass=function(length, addUpper, addSymbols, addNums) {
        var lower = "abcdefghijklmnopqrstuvwxyz";
        var upper = addUpper ? lower.toUpperCase() : "";
        var nums = addNums ? "0123456789" : "";
        var symbols = addSymbols ? "!#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~" : "";

        var all = lower + upper + nums + symbols;
        while (true) {
            var pass = "";
            for (var i=0; i<length; i++) {
                pass += all[Math.random() * all.length | 0];
            }

            // criteria:
            if (!/[a-z]/.test(pass)) continue; // lowercase is a must
            if (addUpper && !/[A-Z]/.test(pass)) continue; // check uppercase
            if (addSymbols && !/\W/.test(pass)) continue; // check symbols
            if (addNums && !/\d/.test(pass)) continue; // check nums

            $scope.terminal.user_password=pass;
            return $scope.terminal.user_password;
        }
    }

    $scope.getInforcedStockist=function(){
        var request = $http({
            method: "get",
            url: api_url+"/getAllStockists",
            dataType:JSON,
            data: {}
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.stockistList=response.data;
            if($scope.stockistList.length!=0){
                $scope.terminal.stockist = $scope.stockistList[0];
                $scope.getNextUserId($scope.terminal.stockist.serial_number,$scope.terminal.stockist.id);
            }
            var stockistId=$scope.users.userLoginid;
            var personCatTd=$scope.users.person_category_id;
            if(personCatTd==4){
                $scope.stockistList=alasql("SELECT *  from ? where user_id=?",[$scope.stockistList,stockistId]);
            }
        });
    };
    $scope.getInforcedStockist();


    $scope.updateTerminalFromTable = function(terminal) {
        $scope.tab=1;
        $scope.terminal = angular.copy(terminal);
        $scope.isUpdateable=true;
        var index=$scope.terminalList.indexOf(terminal);
        $scope.updateableTerminalIndex=index;
        var stockistIndex=$scope.findObjectByKey($scope.stockistList,'id',terminal.stockist_id);
        
        $scope.terminal.stockist=stockistIndex;
        $scope.terminalForm.$setPristine();
    };

    $scope.updateTerminalByTerminalId=function(terminal){
        var master = terminal;
        var request = $http({
            method: "post",
            url: api_url+"/updateTerminalDetails",
            dataType:JSON,
            data: {
                terminal: master
            }
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.terminalReport=response.data;
            if($scope.terminalReport.success==1){
                $scope.updateStatus = true;
                $scope.isUpdateable=true;
                $timeout(function() {
                    $scope.updateStatus = false;
                }, 4000);
                $scope.terminalList[$scope.updateableTerminalIndex]=$scope.terminal;
                $scope.terminalForm.$setPristine();
            }

        });
    };


    $scope.resetTerminalDetails=function () {
        var tempStockist = $scope.terminal.stockist;
        $scope.terminal={};
        $scope.terminal.stockist = tempStockist;
        $scope.getNextUserId($scope.terminal.stockist.serial_number,$scope.terminal.stockist.id);
        $scope.isUpdateable=false;
    };

    $scope.getNextUserId=function (serialNo,stockistId) {
        var request = $http({
            method: "post",
            url: api_url+"/selectNextTerminalId",
            dataType:JSON,
            data: {
                serialNo: serialNo
                ,stockistId: stockistId
            }
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.terminal.user_id=response.data;
        });
    };
    


    $scope.getActiveTerminalList=function(){
        var request = $http({
            method: "get",
            url: api_url+"/getActiveTerminal",
            dataType:JSON,
            data: {}
            ,headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function(response){
            $scope.onlineTerminal=response.data;
        });
    };
    $scope.getActiveTerminalList();

    $scope.forceLogoutActiveTerminal=function(terminal){
        var confirm = $mdDialog.confirm()
        .title('Are you sure to Logout ' + terminal.user_id + '?')
        .textContent('Terminal will be logged out from current device')
        .ariaLabel('Sukanta Hui')
        .targetEvent(event)
        .ok('Yes')
        .cancel('No');
        $mdDialog.show(confirm).then(function() {
            var request = $http({
                method: "put",
                url: api_url+"/terminalForceLogout",
                dataType:JSON,
                data: {
                    id: terminal.id
                }
                ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function(response){
                $scope.onlineUserStatus=response.data;
                if($scope.onlineUserStatus){
                    $scope.showAlert(this.ev,'Terminal loggedout','');
                }
            });
        
        }, function() {
            //not to Logout
        });
    };
});

