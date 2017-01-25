'use strict';

angular.module('airoSenseApp.dashboard', ['ngRoute', 'chart.js'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/dashboard', {
            templateUrl: '/dashboard/dashboard.html',
            controller: 'DashboardCtrl'
        });
    }])
    .controller('DashboardCtrl', ['$scope', '$rootScope', '$location', 'airosenseService', '$interval', '$http', function ($scope, $rootScope, $location, airosenseService, $interval, $http) {
        $scope.showModal = false;
        $scope.toggleModal = function(){
            $scope.showModal = !$scope.showModal;
        };

        var headers = {
            "Content-Type":"application/json",
            "Accept":"application/json"
        };

        function sendRequest(token, phone, data){
            var data = {
                "token": token,
                "customerName":"Purval Shah",
                "numberToDial":phone,
                "msg": data
            };

            $http({
              method: 'POST',
              url: 'https://api.tropo.com/1.0/sessions',
              headers: headers,
              data: data
            }).then(function successCallback(response) {
                $("#modalnotify").modal('hide');
            }, function errorCallback(response) {
               console.log(response); 
            });
        }

        $scope.sendSMS = function(inputtxt){
            var phone = $("#phone").val();
            var phoneno= /^\d{10}$/;
           
            if(phone != "" && inputtxt.match(phoneno)){
                var devicedata = $scope.allDevicesData[$scope.item.deviceid].aqi;
                for(var i=0;i<devicedata.length;i++){
                    if(devicedata[i].alert_code == 3){
                        var message = "The device "+devicedata[i].deviceid+" is found in red zone with (key="+devicedata[i].key+" value="+devicedata[i].value.toFixed(2)+" "+devicedata[i].units+") has AQI value of "+devicedata[i].aqi+". Needs your immediate attention.";
                        //var message = "Device "+devicedata[i].deviceid+" is emitting "+devicedata[i].key+" value "+devicedata[i].value+" "+devicedata[i].units+" has AQI of "+devicedata[i].aqi;
                        sendRequest("6b586450796f5941735958784b546b4a71784a6b4c51635472726e6f6e6a667141756659624f5543705a6766",
                        phone, message);
                    }
                }    
            }
        };

        $scope.callUser = function(inputtxt){
            var phone = $("#phone").val();
            var phoneno= /^\d{10}$/;
            if(phone != "" && inputtxt.match(phoneno)){
                /*var message = "The device "+devicedata[i].deviceid+" is found in red zone with (key="+devicedata[i].key+" value="+devicedata[i].value+" "+devicedata[i].units+") has AQI value of "+devicedata[i].aqi+". Needs your immediate attention.";
                //var message = "Some devices are in risk zone. Needs immediate attention";
                sendRequest("7275465a4e486e556e6e414466724a784e656c615763554a4d6b765663556a7775796250485a764a5659507a",
                    phone, message);*/
                var devicedata = $scope.allDevicesData[$scope.item.deviceid].aqi;
                for(var i=0;i<devicedata.length;i++){
                    if(devicedata[i].alert_code == 3){
                        var message = "The device "+devicedata[i].deviceid+" is found in red zone with (key="+devicedata[i].key+" value="+devicedata[i].value.toFixed(2)+" "+devicedata[i].units+") has AQI value of "+devicedata[i].aqi+". Needs your immediate attention.";
                        //var message = "Device "+devicedata[i].deviceid+" is emitting "+devicedata[i].key+" value "+devicedata[i].value+" "+devicedata[i].units+" has AQI of "+devicedata[i].aqi;
                        sendRequest("7275465a4e486e556e6e414466724a784e656c615763554a4d6b765663556a7775796250485a764a5659507a",
                        phone, message);
                        break;
                    }
                } 
            }
        };
		
        $scope.showhide = function(){
            $("#meeting_div").toggle();
        };

        $scope.meeting = function(email){
            localStorage.ciscosparkid = "rajeev@itboons.com";
            window.open("http://localhost:6001/dashboard/meeting_room.html?email="+email, "_blank", "toolbar=no,scrollbars=yes,resizable=no,top=50,left=500,width=500,height=600");
            //window.open("https://social5.itboons.local:9444/homepage/nav/common/sources/meeting_room.html?id="+roomId+"&email="+email+"&name="+name, "_blank", "toolbar=no,scrollbars=yes,resizable=no,top=50,left=500,width=500,height=600");
        };
		
        $scope.liveData = '';
        $scope.heading = 'Air Quality Index';
        $scope.reportType = {
            report: "live"
        };
        $scope.duration = {
            type: "day"
        };

        $scope.userDevices = JSON.parse(airosenseService.getUserData()).devices.join();

        $scope.chartOptions = {
            "datasetFill": false,
            "scaleShowGridLines": false,
            "bezierCurve": false,
            "pointDot": false,
            "animation": true,
            "pointHitDetectionRadius": 1,
            "scaleLabel": function (valuePayload) {
                if($scope.selection === "PM2p5" || $scope.selection === "PM10")
                return Number(valuePayload.value) + ' ug/m3';
                else if($scope.selection === "CO" || $scope.selection === "SO2"||$scope.selection === "O3" || $scope.selection === "NO2" || $scope.selection === "VOC" || $scope.selection === "CO2")
                    return Number(valuePayload.value) + ' ppm';
                else if($scope.selection === "radiation")
                    return Number(valuePayload.value) + ' cpm';
            }
        };

        $scope.masterChartColors = {
            "PM2p5": "#f7464a",
            "PM10": "#97bbcd",
            "VOC": "#34ab35",
            "CO2": "#fdb45c"
        }
        //sensor radio
        $scope.sensors = [
            {name: 'PM2p5', selected: true},
            {name: 'PM10', selected: false},
            {name: 'VOC', selected: false},
            {name: 'CO2', selected: false},
            {name: 'NO2', selected: false},
            {name: 'SO2', selected: false},
            {name: 'CO', selected: false},
            {name: 'O3', selected: false},
            {name: 'radiation', selected: false}
        ];
        // selected sensors
        $scope.selection = "PM2p5";
        $scope.chartColors = [];

        // watch sensors for changes
        $scope.$watch('selection', function (nv) {
            $("#loader").show();
            /*$scope.selection = nv.map(function (sensor) {
                return sensor.name;
            });*/
            //console.log($scope.selection);
            $scope.series = [$scope.selection];
            $scope.chartData = [];
            $scope.chartData.push($scope.masterData[$scope.selection]);
            /*for (var key in $scope.selection) {
                $scope.chartData.push($scope.masterData[$scope.selection[key]]);
                $scope.chartColors.push($scope.masterChartColors[$scope.selection[key]]);
            }*/
            $("#loader").hide();
        }, true);

        $scope.$watch('duration.type', function (value) {
            $scope.getHistoricRangeData();
            $scope.getLiveSensorData();
        });
        $scope.$watch('reportType.report', function (value) {
            if ($scope.reportType.report === 'historic') {
                $scope.heading = 'Past Pollutant Data';
            } else if ($scope.reportType.report === 'table') {
                $scope.heading = 'Live Pollutant Data';
            }
            else {
                $scope.heading = 'Air Quality Index';
            }
        });

        $scope.labels = [0, 5, 10, 15, 20, 25, 30];
        $scope.onClick = function (points, evt) {
            // console.log(points, evt);
        };
        $('a[href="#dashboard"]').addClass('selected');
        $('a[href="#device-health"]').removeClass('selected');
        $('a[href="#data-usage"]').removeClass('selected');
        $rootScope.$broadcast('myCustomEvent', {item: 'dashboard'});
        $scope.showDetail = function (type) {
            $location.url('/dashboard/' + type)
        }
        var aqiURL = '/api/aqi';
        $scope.getData = function () {
            airosenseService.getDeviceData(aqiURL + "?deviceId=" + $scope.userDevices)
                .then(function (data) {
                    $scope.allDevicesData = data;
                    $scope.numOfDevices = Object.size(data);
                    $scope.deviceList = Object.getDevicesByAlert(data, 'PM2p5');

                    $scope.count = {
                        high: Object.size($scope.deviceList.high),
                        low: Object.size($scope.deviceList.low),
                        medium: Object.size($scope.deviceList.medium)
                    };
                    $rootScope.deviceCount = $scope.count.high + $scope.count.low + $scope.count.medium;
                    // console.log( $scope.count);
                    $(document).ready(function () {

                        /*Start: Number Animation*/

                        (function () {

                            $('#devices-indicator .alert').each(function (i, el) {

                                setTimeout(function () {

                                    $(el).addClass('alert-loaded');

                                    var old = $(el).attr('i-value') ? $(el).attr('i-value') * 10 : 0;
                                    var current = $(el).find('span').html() * 1;

                                    var k = 0;
                                    var d = current > old ? 1 : -1;
                                    var c = old;
                                    do {

                                        setTimeout((function (c, el) {
                                            return function () {
                                                $(el).find('span').html(c).css('color', '#000');
                                            };
                                        })(c, el), 100 * k);

                                        c += d;

                                        k++;

                                    } while (c != current + d);

                                }, 200 * i);

                            });
                        })();

                        /*End: Number Animation*/

                        /*Indicator click event*/
                        $('#devices-indicator .alert').click(function () {
                            $('.alert-selected').removeClass('alert-selected');
                            $(this).addClass('alert-selected');
                            $('#device-details').removeAttr('style').addClass('device-details-opened').removeClass('device-details-0').removeClass('device-details-1').removeClass('device-details-2').addClass('device-details-' + $(this).index());
                        });

                    });
                },
                function () {
                    $scope.numOfDevices = 0;
                    $scope.deviceList = {};
                    $scope.count = {high: 0, low: 0, medium: 0};
                    $(document).ready(function () {

                        /*Start: Number Animation*/

                        (function () {

                            $('#devices-indicator .alert').each(function (i, el) {

                                setTimeout(function () {

                                    $(el).addClass('alert-loaded');

                                    var old = $(el).attr('i-value') ? $(el).attr('i-value') * 10 : 1;
                                    var current = $(el).find('span').html() * 1;

                                    var k = 0;
                                    var d = current > old ? 1 : -1;
                                    var c = old;
                                    do {

                                        setTimeout((function (c, el) {
                                            return function () {
                                                $(el).find('span').html(c).css('color', '#000');
                                            };
                                        })(c, el), 100 * k);

                                        c += d;

                                        k++;

                                    } while (c != current + d);

                                }, 200 * i);

                            });
                        })();

                        /*End: Number Animation*/

                        /*Indicator click event*/
                        $('#devices-indicator .alert').click(function () {
                            $('.alert-selected').removeClass('alert-selected');
                            $(this).addClass('alert-selected');
                            $('#device-details').removeAttr('style').addClass('device-details-opened').removeClass('device-details-0').removeClass('device-details-1').removeClass('device-details-2').addClass('device-details-' + $(this).index());
                        });

                    });
                });
        };
        $scope.getDataAsyn = function () {
            $http.get(aqiURL + "?deviceId=" + $scope.userDevices)
                .success(function (data) {
                    //$scope.$on('$destroy', function(){
                    //    $timeout.cancel($timeout($scope.getDataAsyn, 120000));
                    //    $timeout.cancel($timeout($scope.getSensorData,120000));
                    //});
                    $scope.allDevicesData = data;
                    $scope.numOfDevices = Object.size(data);
                    $scope.deviceList = Object.getDevicesByAlert(data, 'PM2p5');
                    $scope.count = {
                        high: Object.size($scope.deviceList.high),
                        low: Object.size($scope.deviceList.low),
                        medium: Object.size($scope.deviceList.medium)
                    };
                    //$timeout($scope.getDataAsyn, 120000);
                    //$timeout($scope.getSensorData,120000);
                });
        };

        $scope.showData = function (type) {
            //var canvas = document.getElementById('line');
            //if (canvas){
            //    var ctx = canvas.getContext('2d');
            //    ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
            //}
            $scope.series = ['no-data'];
            $scope.chartData = [['0']];
            $scope.masterData = [['0']];
            var classObj = {};
            classObj.PM0p3 = {level: '', on: ""};
            classObj.PM2p5 = {level: '', on: ""};
            classObj.PM10 = {level: '', on: ""};
            classObj.VOC = {level: '', on: ""};
            classObj.CO2 = {level: '', on: ""};
            $scope.trendsstatsObj = classObj;
            if (type == 3) {
                $scope.deviceDropDownData = $scope.deviceList.high
                $scope.item = {deviceid: $scope.deviceDropDownData[0].deviceid}
            }
            if (type == 2) {
                $scope.deviceDropDownData = $scope.deviceList.medium
                $scope.item = {deviceid: $scope.deviceDropDownData[0].deviceid}
            }
            if (type == 1) {
                $scope.deviceDropDownData = $scope.deviceList.low
                $scope.item = {deviceid: $scope.deviceDropDownData[0].deviceid}
            }
            $scope.getSensorData();
            $scope.getHistoricRangeData();
            $scope.getLiveSensorData();
        }
        $scope.getSensorData = function () {
            try {
                $scope.getDataAsyn();
                var classObj = {};
                var result = $scope.allDevicesData[$scope.item.deviceid].aqi.map(function (a) {
                    var key = a.key;
                    var scale = a.scale;
                    var alert = a.alert_code;
                    classObj[key] = {
                        level: 'level-' + alert,
                        on: 'on-' + scale,
                        value: a.aqi,
                        avg: Math.round(a.value)
                    };
                    $scope.trendsstatsObj = classObj;
                });
            }
            catch (err) {
                console.log(err);
            }

            // console.log($scope.trendsstatsObj);
        }

        $scope.updateHistory = function () {
            try {
                $scope.series = ['no-data'];
                $scope.chartData = [['0']];
                //get history data
                $scope.getHistoricRangeData();
                $scope.getLiveSensorData();
            }
            catch (err) {
                console.log(err);
            }
        }

        $scope.updateGraph = function () {
            try {
                $scope.getHistoricRangeData();
                $scope.getLiveSensorData();
            }
            catch (err) {

            }
        }


        $scope.getHistoricRangeData = function () {
            $("#loader").show();
            var d = new Date();
            var to = d.getTime();
            $scope.series = ['no-data'];
            $scope.chartData = [['0']];
            if ($scope.duration.type == "day") {
                var url = '/api/historian?deviceId=' + $scope.item.deviceid + '&tzOffset=' + d.getTimezoneOffset();
            }
            else if ($scope.duration.type == "week") {
                var from = to - 604800000;
                var url = '/api/historian?deviceId=' + $scope.item.deviceid + '&from=' + from + '&to=' + to + '&tzOffset=' + d.getTimezoneOffset();
            }
            else {
                var from = to - 2592000000;
                var url = '/api/historian?deviceId=' + $scope.item.deviceid + '&from=' + from + '&to=' + to + '&tzOffset=' + d.getTimezoneOffset();
            }
            try {
                $http.get(url)
                    .success(function (data) {
                        $scope.masterData = data;
                        $scope.chartData = [];
                        var tempArr = [];
                        $scope.series = [$scope.selection];
                        tempArr.push(data[$scope.selection]);
                        $scope.chartColors.push($scope.masterChartColors[$scope.selection]);
                       /* for (var key in $scope.selection) {
                            tempArr.push(data[$scope.selection[key]]);
                            $scope.chartColors.push($scope.masterChartColors[$scope.selection[key]]);
                        }*/
                        $scope.chartData = angular.copy(tempArr);
                        $scope.labels = data.timescale;
                        $("#loader").hide();
                    });
            }
            catch (err) {
                $scope.series = ['no-data'];
                $scope.chartData = [['0']];
            }

        }
        var $chart;
        $scope.$on("create", function (event, chart) {
            if (typeof $chart !== "undefined") {
                $chart.destroy();
            }
            $chart = chart;
        });
        $scope.$on('update', function (event, chart) {
            if (chart) chart.update();
        });
        $scope.getData();
        $scope.getLiveSensorData = function () {
            if ($scope.item.deviceid) {
                var url = '/api/data?deviceId=' + $scope.item.deviceid;
                try {
                    $http.get(url)
                        .success(function (data) {
                            $scope.liveData = data;
                            if(data.latitude && data.longitude) {
                                $scope.getLocation(data.latitude, data.longitude);
                            } else {
                                $scope.deviceLocation=data.location;
                            }
                        });
                }
                catch (err) {
                    $scope.liveData = '';
                }
            } else {
                $scope.liveData = '';
            }

        }
        //jquery for calender and chart
        var promiseInterval;
        $(document).ready(function () {
            /*$("#from").datepicker({
             numberOfMonths: 1,
             defaultDate: "-1m",
             "dateFormat" : "yy/mm/dd",
             onClose: function (selectedDate) {
             $("#to").datepicker("option", "minDate", selectedDate);
             }
             });
             $("#to").datepicker({
             defaultDate: "+1w",
             numberOfMonths: 1,
             "dateFormat" : "yy/mm/dd",
             onClose: function (selectedDate) {
             $("#from").datepicker("option", "maxDate", selectedDate);
             }
             });*/


            $("input[name='report-type']").change(function () {
                if ($("input[name='report-type']:checked").val() === 'historic') {
                    $("#historic-report").slideDown(200);
                    $("#live-sensors").slideUp(200);
                    $("#live-table").slideUp(200);
                    if (promiseInterval) {
                        promiseInterval.cancel();
                    }
                } else if ($("input[name='report-type']:checked").val() === 'live') {
                    $("#historic-report").slideUp(200);
                    $("#live-sensors").slideDown(200);
                    $("#live-table").slideUp(200);
                    if (promiseInterval) {
                        promiseInterval.cancel();
                    }
                } else {
                    $("#historic-report").slideUp(200);
                    $("#live-sensors").slideUp(200);
                    $("#live-table").slideDown(200);
                    $scope.getLiveSensorData();
                    promiseInterval = $interval($scope.getLiveSensorData, 120000);
                }

            });

        });

        function shiftDate(date, hrsOffset) {
            var d2 = new Date(date);
            d2.setHours(date.getHours() - hrsOffset);
            return formatAMPM(d2);
        }

        function shiftDay(date, dayOffset) {
            var d2 = new Date(date);
            d2.setDate(date.getDate() - dayOffset);
            var weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            return weekday[d2.getDay()];
        }

        function formatAMPM(date) {
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
            return strTime;
        }
        $scope.formatDate = function(d){
            return new Date(d).toString();
        }
        $scope.getLocation = function (lat, lng ) {
            if (lat && lng) {
                var geocoder = new google.maps.Geocoder();
                var latlng = {lat: parseFloat(lat), lng: parseFloat(lng)};
                geocoder.geocode({'latLng': latlng}, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            $scope.deviceLocation = results[1].formatted_address;
                        } else {
                            //console.log("no location found");
                        }
                    } else {
                        //console.log("no result");
                    }
                });
            } else {
                $scope.deviceLocation = "";
            }
        }
    }])
.directive('modal', function () {
    return {
        template: '<div class="modal fade">' +
        '<div class="modal-dialog">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
        '<h4 class="modal-title">{{ title }}</h4>' +
        '</div>' +
        '<div class="modal-body" ng-transclude></div>' +
        '</div>' +
        '</div>' +
        '</div>',
        restrict: 'E',
        transclude: true,
        replace:true,
        scope:true,
        link: function postLink(scope, element, attrs) {
            scope.title = attrs.title;

            scope.$watch(attrs.visible, function(value){
                if(value == true)
                    $(element).modal('show');
                else
                    $(element).modal('hide');
            });

            $(element).on('shown.bs.modal', function(){
                scope.$apply(function(){
                    scope.$parent[attrs.visible] = true;
                });
            });

            $(element).on('hidden.bs.modal', function(){
                scope.$apply(function(){
                    scope.$parent[attrs.visible] = false;
                });
            });
        }
    };
});