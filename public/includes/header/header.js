'use strict';

angular.module('airoSenseApp')
	.directive('header',function(){
		return {
        templateUrl:'/includes/header/header.html',
        restrict: 'E',
        replace: true,
			scope: {
			},
			controller:function($scope,$rootScope,$location,airosenseService){
				$scope.userData = JSON.parse(airosenseService.getUserData());
				$rootScope.$on('myCustomEvent', function (event, args) {
					$scope.classname = "active-nav"
				});
				$scope.activateNav = function(type){
					if(type == 'dashboard'){
						$('a[href="#dashboard"] > span').addClass('selected');
						$('a[href="#device-health"] > span').removeClass('selected');
					}
					else if(type == 'health'){
						$('a[href="#device-health"] > span').addClass('selected');
						$('a[href="#dashboard"] > span').removeClass('selected');
					}

				}
				$scope.showMenu = function(){
					$('.welcome-user-dropdown').toggle();
				}
				$scope.showHomePage= function(){
					window.location.reload();
				}
				//$scope.activateNav();
			}
    	}
	})



