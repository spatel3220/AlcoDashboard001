'use strict';

// Declare app level module which depends on views, and components
angular.module('airoSenseApp', [
    'ngRoute',
    'airoSenseApp.dashboard',
    'airoSenseApp.devicehealth',
    'airoSenseApp.datausage',
    'airoSenseApp.billboard'
])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/dashboard'});
    }])
    .run(['airosenseService','$location','$rootScope', function (airosenseService,$location,$rootScope) {
        var userData = JSON.parse(airosenseService.getUserData());
        if("Gandhinagar"===userData.firstName){ //any criteria to show redirect to billboard on start
            $location.path("/billboard");
        }
        $rootScope.$on( "$routeChangeStart", function(event, next, current) {
            if("Gandhinagar"===userData.firstName){ //any criteria to show redirect to billboard on start
                $location.path("/billboard");
            }
        });

    }])
    .controller('MainCtrl', ['$scope', '$rootScope', '$location', 'airosenseService', function ($scope, $rootScope, $location, airosenseService) {

        angular.element(document).on('click', function () {
            $('.welcome-user-dropdown').hide();
            $scope.loggedInClose = true;
            $scope.$apply();
        });

        $scope.toggleHF = function () {
            return '/billboard' != $location.path();
        }
    }]);