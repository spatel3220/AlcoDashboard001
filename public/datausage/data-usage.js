'use strict';

angular.module('airoSenseApp.datausage', ['ngRoute','chart.js'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/data-usage', {
    templateUrl: '/datausage/data-usage.html',
    controller: 'DataUsageCtrl'
  });
}])
.controller('DataUsageCtrl', ['$scope','$rootScope','$location','airosenseService','$timeout','$http',function($scope,$rootScope,$location,airosenseService,$timeout,$http){
        $('a[href="#device-health"]').removeClass('selected');
        $('a[href="#dashboard"]').removeClass('selected');
        $('a[href="#data-usage"]').addClass('selected');
        $scope.labels = ["January", "February", "March", "April"],
        $scope.data = [
            [65, 59, 80, 81]
        ];

        $("#from").datepicker({
            numberOfMonths: 1,
            defaultDate: "-1m",
            onClose: function (selectedDate) {
                $("#to").datepicker("option", "minDate", selectedDate);
            }
        });
        $("#to").datepicker({
            defaultDate: "+1w",
            numberOfMonths: 1,
            onClose: function (selectedDate) {
                $("#from").datepicker("option", "maxDate", selectedDate);
            }
        });


    }]);