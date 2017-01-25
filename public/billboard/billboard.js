'use strict';

angular.module('airoSenseApp.billboard', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/billboard', {
            templateUrl: '/billboard/billboard.html',
            controller: 'BillboardCtrl'
        });
    }])
    .controller('BillboardCtrl', ['$scope', '$rootScope', '$location', 'airosenseService', '$interval', '$timeout', '$http', function ($scope, $rootScope, $location, airosenseService, $interval, $timeout, $http) {
        //bhavya code starts
        $scope.testDevice = 'fa5e17fcf5c';
        $scope.cloudImage = '';
        $scope.arrowImage = '../assets/images/arrow-up.png';
        $scope.testalert = '';
        $scope.liveTestData = '';
        //converting UTC to IST
        var date = new Date();
        var offsetIST = 5.5;
        var utcdate = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
        var istdate = new Date(utcdate.getTime() - ((-offsetIST * 60) * 60000));
        var dayArr = ["Sun","Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        var monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        $scope.testMonth = monthArr[istdate.getMonth()];
        $scope.testDay = dayArr[istdate.getDay()];
        var time = istdate.getHours();
        $scope.hours=istdate.getHours();
        $scope.minutes=istdate.getMinutes();
        $scope.testDate = istdate.getDate();
        var getTestDataAsync = function () {
            var aqiURL = '/api/aqi'
            $http.get(aqiURL + "?deviceId=" + $scope.testDevice+"&_="+Math.random())
                .success(function (data) {
                    var result;
                    $scope.alltestDevicesData = data;
                    $scope.numOfDevices = Object.size(data);
                    $scope.deviceList = Object.getDevicesByAlert(data, 'PM2p5');
                    $scope.count = {
                        high: Object.size($scope.deviceList.high),
                        low: Object.size($scope.deviceList.low),
                        medium: Object.size($scope.deviceList.medium)
                    };
                    var classObj = {};
                    result = $scope.alltestDevicesData[$scope.testDevice].aqi.map(function (a) {
                        var key = a.key;
                        var scale = a.scale;
                        var alert = a.alert_code;
                        classObj[key] = {
                            level: 'level-' + alert,
                            on: 'on-' + scale,
                            value: a.aqi,
                            avg: Math.round(a.value)
                        };
                        $scope.testObj = classObj;
                        var val = $scope.testObj.PM2p5.value;
                        if (val <= 100) {
                            $scope.testalert = "Low";
                            $scope.whiteArrow='/assets/images/arrow-down-white.png';
                            $scope.myArrow={'margin-left': '535px'};
                            $scope.myStyle = {color: '#4caf50'};
                            if(time>=19 || time<6){
                                $scope.textStyle={color:'#4caf50'};
                                $scope.container={'background-color':'#1d2028'};
                                $scope.innerRectangle={'background-color':'#4caf50'};
                                $scope.topImage='/assets/images/icon-low-nt.png';
                                $scope.airosenseText={color: '#ffffff'};
                                $scope.myFooter={'background-color': '#565b69'};
                                $scope.tempImage='/assets/images/temp-low.png';
                                $scope.pollutionText={color: '#ffffff'};
                                $scope.arrowImage='/assets/images/arrow-down-white.png';
                            }
                            else if(time >=6  && time < 19){
                                $scope.topImage='/assets/images/img-low-green.png';
                                $scope.arrowImage='/assets/images/arrow-down.png';
                                $scope.container={'background-color':'#4caf50'};
                                $scope.textStyle={color:'#ffffff'};
                                $scope.innerRectangle={'background-color':'#9ccc65'};
                                $scope.tempImage='/assets/images/temp.png';
                            }
                        }
                        else if(val>=101 && val<=200){
                            $scope.testalert="Moderate";
                            $scope.whiteArrow='/assets/images/arrow-up.png';
                            $scope.myArrow={'margin-left': '848px'};
                            if(time>=19 || time<6){
                                $scope.textStyle={color:'#ffc107'};
                                $scope.container={'background-color':'#1d2028'};
                                $scope.innerRectangle={'background-color':'#ffd200'};
                                $scope.topImage='/assets/images/icon-moderate-nt.png';
                                $scope.airosenseText={color: '#ffffff'};
                                $scope.myFooter={'background-color': '#565b69'};
                                $scope.tempImage='/assets/images/temp-mod.png';
                                $scope.pollutionText={color: '#ffffff'};
                                $scope.arrowImage='/assets/images/arrow-up.png'
                            }
                            else if(time >=6  && time < 19){
                                $scope.topImage='/assets/images/img-mod-yellow.png';
                                $scope.container={'background-color':'#ffc107'}
                                $scope.textStyle={color:'#ffffff'};
                                $scope.innerRectangle={'background-color':'#ffe680'};
                                $scope.tempImage='/assets/images/temp.png';
                            }
                        }
                        else{
                            $scope.testalert="High";
                            $scope.whiteArrow='/assets/images/arrow-up.png';
                            if(time>=19 || time<6){
                                $scope.textStyle={color:'#f23f2c'};
                                $scope.container={'background-color':'#1d2028'};
                                $scope.innerRectangle={'background-color':'#f23f2c'};
                                $scope.topImage='/assets/images/icon-high-nt.png';
                                $scope.airosenseText={color: '#ffffff'};
                                $scope.myFooter={'background-color': '#565b69'};
                                $scope.tempImage='/assets/images/img-nt-cloudy.png';
                                $scope.pollutionText={color: '#ffffff'};
                                $scope.arrowImage='/assets/images/arrow-up.png'
                            }
                            else if(time >=6  && time < 19){
                                $scope.topImage='/assets/images/img-high-red.png';
                                $scope.container={'background-color': '#f44336' };
                                $scope.textStyle={color:'#ffffff'};
                                $scope.innerRectangle={'background-color':'#ef9a9a'};
                                $scope.tempImage='/assets/images/temp.png';
                            }
                        }
                    }).error(function (err) {
                        console.log(err);
                    });
                });
        };
        var getLiveTestData = function () {
            if ($scope.testDevice) {
                var url = '/api/data?deviceId=' + $scope.testDevice;
                try {
                    $http.get(url)
                        .success(function (data) {
                            $scope.liveTestData = data;
                            //added by bhavya
                            //changed css to fix alignment issues
                            var co2=$scope.liveTestData.CO2;
                            var so2=$scope.liveTestData.SO2;
                            var no2=$scope.liveTestData.NO2;
                            var o3=$scope.liveTestData.O3;
                            var co=$scope.liveTestData.CO;
                            var radiation=$scope.liveTestData.radiation;

                            if(radiation<50){
                                $scope.radiationValue="Low";
                                $scope.radiationBackground={'background-color':'#4caf50'};

                            } else if(radiation>=50 && radiation<100){
                                $scope.radiationValue="Medium";
                                $scope.radiationBackground={'background-color':'#ffc107'};

                            } else {
                                $scope.radiationValue="High";
                                $scope.radiationBackground={'background-color':'#f23f2c'};
                            }
                            if(o3<0.1){
                                $scope.O3Value="Low";
                                $scope.O3alert={'margin-left': '569px'};
                                $scope.O3Background={'background-color':'#4caf50'};

                            } else if(o3>=0.1 && o3<1){
                                $scope.O3Value="Medium";
                                $scope.O3alert={'margin-left': '565px'};
                                $scope.O3Background={'background-color':'#ffc107'};

                            } else {
                                $scope.O3Value="High";
                                $scope.O3alert={'margin-left': '565px'};
                                $scope.O3Background={'background-color':'#f23f2c'};

                            }
                            if(co<0.4){
                                $scope.COValue="Low";
                                $scope.COalert={'margin-left': '808px'};
                                $scope.COBackground={'background-color':'#4caf50'};

                            } else if(co>=0.4 && co<1){
                                $scope.COValue="Medium";
                                $scope.COalert={'margin-left': '803px'};
                                $scope.COBackground={'background-color':'#ffc107'};

                            } else {
                                $scope.COValue="High";
                                $scope.COalert={'margin-left': '806px'};
                                $scope.COBackground={'background-color':'#f23f2c'};

                            }
                            if(so2<0.4){
                                $scope.SO2Value="Low";
                                $scope.SO2alert={'margin-left': '565px'};
                                $scope.SO2Background={'background-color':'#4caf50'};

                            } else if(so2>=0.4 && so2<1){
                                $scope.SO2Value="Medium";
                                $scope.SO2alert={'margin-left': '563px'};
                                $scope.SO2Background={'background-color':'#ffc107'};

                            } else {
                                $scope.SO2Value="High";
                                $scope.SO2alert={'margin-left': '565px'};
                                $scope.SO2Background={'background-color':'#f23f2c'};

                            }
                            if(no2<0.4){
                                $scope.NO2Value="Low";
                                $scope.NO2alert={'margin-left': '804px'};
                                $scope.NO2Background={'background-color':'#4caf50'};

                            } else if(no2>=0.4 && no2<1){
                                $scope.NO2Value="Medium";
                                $scope.NO2alert={'margin-left': '803px'};
                                $scope.NO2Background={'background-color':'#ffc107'};

                            } else {
                                $scope.NO2Value="High";
                                $scope.NO2alert={'margin-left': '802px'};
                                $scope.NO2Background={'background-color':'#f23f2c'};

                            }
                            if(co2<500){
                                $scope.CO2Value="Low";
                                $scope.CO2alert={'margin-left': '569px'};
                                $scope.CO2Background={'background-color':'#4caf50'};

                            } else if(co2>=500 && co2<1000){
                                $scope.CO2Value="Medium";
                                $scope.CO2alert={'margin-left': '565px'};
                                $scope.CO2Background={'background-color':'#ffc107'};

                            } else {
                                $scope.CO2Value="High";
                                $scope.CO2alert={'margin-left': '568px'};
                                $scope.CO2Background={'background-color':'#f23f2c'};

                            }
                            //bhavya code ends
                        });
                }
                catch (err) {
                    $scope.liveData = '';
                }
            } else {
                $scope.liveData = '';
            }

        };
        var getLiveData = function(){
            console.log("invoking function again");
            getLiveTestData();
            getTestDataAsync();
        };
        $scope.currentScreenId = "screen1";
        $scope.footerScreenId= "newDashboard";

//bhavya code ends
        var toggleScreens= function(){
            var screenIds = ["screen1","screen2", "screen3", "screen4"];
            var selectedIndex = screenIds.indexOf($scope.currentScreenId);

            if(selectedIndex===(screenIds.length-1)){
                $scope.currentScreenId = screenIds[0];
            } else {
                if(selectedIndex === 0) {
                    var footerscreenIds = ["newDashboard", "noisy", "sensor1", "sensor2", "sensor3"];
                    var footerselectedIndex = footerscreenIds.indexOf($scope.footerScreenId);
                    if(footerselectedIndex===(footerscreenIds.length-1)){
                        $scope.currentScreenId = screenIds[selectedIndex + 1];
                        $scope.footerScreenId = footerselectedIndex[0];

                    } else {
                        $scope.footerScreenId = footerscreenIds[footerselectedIndex + 1];
                    }
                }
                else{
                    $scope.currentScreenId = screenIds[selectedIndex + 1];
                }
            }
        };
        //Call once on init
        getLiveData();
        //Schedule for later
        $interval(toggleScreens,120000); //every 2 minutes
        $interval(getLiveData,300000); // every 5 minutes
    }]);