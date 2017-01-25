'use strict';

angular.module('airoSenseApp.devicehealth', ['ngRoute','chart.js'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/device-health', {
    templateUrl: '/devicehealth/device-health.html',
    controller: 'DeviceHealthCtrl'
  });
}])
.controller('DeviceHealthCtrl', ['$scope','$rootScope','$location','airosenseService','$timeout','$http',function($scope,$rootScope,$location,airosenseService,$timeout,$http){
        $scope.pieOptions = {
            showTooltips : false,
            animation: true,
            percentageInnerCutout : 70,
            animateRotate:true,
            onAnimationComplete: function() {

                var canvasWidthvar = $('#pie').width();
                var canvasHeight = $('#pie').height();
                //this constant base on canvasHeight / 2.8em
                var constant = 100;
                var fontsize = (canvasHeight/constant).toFixed(2);
                console.log(fontsize);
                var ctx = $('#pie').get(0).getContext("2d");
                var ctx = this.chart.ctx;
                //ctx.font=fontsize +"em Verdana";
                ctx.font=(fontsize*30) +"px Helvetica";
                ctx.textBaseline="bottom";
                ctx.fillStyle = "black";
                var total = 0;
                var doughnutData = $scope.data;
                $.each(doughnutData,function() {
                    total += parseInt(this,10);
                });
                var text2 = "Devices";
                var textWidth = ctx.measureText(total).width;
                var txtPosx = Math.round((canvasWidthvar - textWidth)/2);
                console.dir(txtPosx+" "+txt2PosX);
                ctx.fillText(total, txtPosx, canvasHeight/2);
                ctx.font= fontsize +"em Helvetica";
                ctx.textBaseline="top";
                var textWidth2 = ctx.measureText(text2).width;
                var txt2PosX = Math.round((canvasWidthvar - textWidth2)/2);
                console.dir(ctx.font);
                ctx.fillText(text2, txt2PosX, canvasHeight/2);
                console.dir(ctx.font);
            }
        };
        $('a[href="#device-health"]').addClass('selected');
        $('a[href="#dashboard"]').removeClass('selected');
        $('a[href="#data-usage"]').removeClass('selected');
        $scope.deviceWrkngCount = $rootScope.deviceCount||0;
        $scope.deviceNtWrkngCount = (JSON.parse(airosenseService.getUserData()).devices.length)-$scope.deviceWrkngCount;
        var device_status_data = [
            {
                value: $scope.deviceNtWrkngCount,
                color: "#FF4D4D",
                highlight: "#FF4D4D",
                label: "Devices not working"
            },
            {
                value: 0,
                color: "#E5EE01",
                highlight: "#E5EE01",
                label: "Devices need maintenance"
            },
            {
                value: $scope.deviceWrkngCount,
                color: "#33B032",
                highlight: "#33B032",
                label: "Devices working"
            }


        ];
        $scope.labels = ["Devices not working", "Devices need maintenance", "Devices working"];
        $scope.data = [ $scope.deviceNtWrkngCount, 0, $scope.deviceWrkngCount];
        $scope.colours= ['#FF4D4D','#E5EE01','#33B032'];
        var dom = {
            css: "tac",
            legends: {
                css: "tal pl30 ml30 mt30",
                html: function (el) {
                    for (var i = 0; i < device_status_data.length; i++) {
                        var d = device_status_data[i];
                        $(el).ihtml({
                            css: "pt15 pb15",
                            ico: {
                                css: "d-ib vam mr20",
                                style: "height:20px; width:20px;background:" + d.color
                            },
                            label: {
                                css: "d-ib vam",
                                html: d.label + ': <b>' + d.value + '</b>'
                            }
                        });
                    }
                }
            }
        };
        $("#legend").ihtml(dom);
        //jquery for calender and chart



}]);