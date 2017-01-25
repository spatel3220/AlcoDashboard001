/**
 * Created by APODI on 1/24/2016.
 */

'use strict';

angular.module('airoSenseApp')
    .directive('footer',function(){
        return {
            templateUrl:'/includes//footer/footer.html',
            restrict: 'E',
            replace: true
        }
    }).controller('navCtrl',['$scope', '$http','$rootScope', function($scope,$http, $rootScope) {
        $rootScope.loggedIn = false;
    }]);




