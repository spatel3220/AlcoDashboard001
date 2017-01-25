/**
 * Created by APODI on 1/27/2016.
 */
/*
/*
sample device data

 {
 "0004251918018c10": {
 "aqi": [{
 "key": "PM2p5",
 "value": 103,
 "units": "ug/m3",
 "aqi": 176,
 "alert_code": 3,
 "scale": ""
 }, {
 "key": "PM10",
 "value": 103,
 "units": "ug/m3",
 "aqi": 176,
 "alert_code": 3,
 "scale": ""
 }]
 }
 }

 */

(function () {
    'use strict';

    angular.module('airoSenseApp').factory('airosenseService', [
        '$http', '$q',
        function airosenseService($http, $q) {
            // interface
            var service = {
                devicesData: [],
                getDeviceData: getDeviceData,
                getDeviceDataUsingHttpOnly: getDeviceDataUsingHttpOnly,
                getUserData:getUserData
            };
            return service;


            // implementation
            function getDeviceData(url) {
                var def = $q.defer();

                $http.get(url)
                    .success(function (data) {
                        service.devicesData = data;
                        def.resolve(data);
                    })
                    .error(function () {
                        def.reject("Failed to get devicesData");
                    });
                return def.promise;
            }

            // implementation of http only
            function getDeviceDataUsingHttpOnly(url) {
                return $http.get(url)
                    .success(function (data) {
                        service.devicesData = data;
                    });
            }

            function getUserData(){
                var userObj = $("#userObj").val();
                return userObj;
            }



        }
    ]);
})();
