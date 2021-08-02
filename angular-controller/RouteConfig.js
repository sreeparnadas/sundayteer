
app.config(function($routeProvider){
    $routeProvider.
    when("/",{
        templateUrl : "ng-views-template/front.html",
        controller: "MainController"
    }).when("/usercounter",{
        templateUrl : "ng-views-template/user_view.html",
        controller: "PlayController"
    }).when("/admin",{
        templateUrl : "ng-views-template/admin.html",
        controller: "adminController"
    }).when("/stockistPanel",{
        templateUrl : "ng-views-template/stockist_home.html",
        controller: "StockistHomeController"
    }).when("/stockist",{
        templateUrl : "ng-views-template/stockist.html",
        controller: "StockistCtrl"
    }).when("/terminal",{
        templateUrl : "ng-views-template/terminal.html",
        controller: "TerminalCtrl"
    }).when("/stlim",{
        templateUrl : "ng-views-template/stockist_limit.html",
        controller: "StockistLimitCtrl"
    }).when("/trlim",{
        templateUrl : "ng-views-template/terminal_limit.html",
        controller: "TerminalLimitCtrl"
    }).when("/payout",{
        templateUrl : "ng-views-template/payout_setting.html",
        controller: "PayoutSettingCtrl"
    }).when("/manualresult",{
        templateUrl : "ng-views-template/manual_result.html",
        controller: "ManualResultCtrl"
    }).when("/custSalesReportCtrl",{
        templateUrl : "ng-views-template/customer_sale_report.html",
        controller: "CustomerSaleReportCtrl",
        // authenticated : true
    }).when("/barcodereport",{
        templateUrl : "ng-views-template/barcode_report.html",
        controller: "BarcodeReportCtrl"
    }).when("/drawreport",{
        templateUrl : "ng-views-template/draw_report.html",
        controller: "DrawReportCtrl"
    }).when("/terminalreport",{
        templateUrl : "ng-views-template/report_terminal.html",
        controller: "ReportTerminalCtrl"
    }).when("/result",{
        templateUrl : "ng-views-template/result.html",
        controller: "ResultCtrl"
    }).when("/previousResult",{
        templateUrl : "ng-views-template/previous_result.html",
        controller: "MainController"
    }).when("/message",{
        templateUrl : "ng-views-template/message.html",
        controller: "ResultCtrl"
    }).when("/DisplayEvent", {
        templateUrl: "ng-views-template/show_event.html",
        controller: "ShowDisplayController"
    }).when("/addresult", {
        templateUrl: "ng-views-template/emergency_result.html",
        controller: "EmergencyResultCtrl"
    }).when("/helpTerminal", {
        templateUrl: "ng-views-template/help_terminal.html",
        controller: "HelpTerminalCtrl"
    }).when("/activeTerminal", {
        templateUrl: "ng-views-template/active_terminal.html",
        controller: "TerminalCtrl"
    }).when("/commonnumbers", {
        templateUrl: "ng-views-template/common_numbers.html",
        controller: "CommonNumbersCtrl"
    }).otherwise ({
        redirectTo: '/DisplayEvent'
    });
});

app.run(["$rootScope","$location","authFact",function($rootScope,$location,authFact){
    $rootScope.$on('$routeChangeStart',function(event,next,current){
       // If route is authenticated then the user should have an accesstoken
       if(next.$$route.authenticated){
           var userAuth = authFact.getAccessToken();
           if(!userAuth){
               $location.path('/');
           }
       }
    })
}]);
