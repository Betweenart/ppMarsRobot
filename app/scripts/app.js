'use strict';

/**
 * @ngdoc overview
 * @name robotsOnMarsApp
 * @description
 * # robotsOnMarsApp
 *
 * Main module of the application.
 */
angular
  .module('robotsOnMarsApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
