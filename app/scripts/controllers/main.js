'use strict';

/**
 * @ngdoc function
 * @name robotsOnMarsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the robotsOnMarsApp
 */
angular.module('robotsOnMarsApp')
  .controller('MainCtrl', function ($scope, marsAdventure) {
    // start having fun...
    $scope.mars = marsAdventure;
    marsAdventure.init({gridId: 'mars'});
  });
