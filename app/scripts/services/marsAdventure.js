'use strict';

/**
 * @ngdoc service
 * @name robotsOnMarsApp.MarsAdventure
 * @description
 * # MarsAdventure
 * Service in the robotsOnMarsApp.
 */
angular.module('robotsOnMarsApp')
  .service('marsAdventure', function ($window) {
    // AngularJS will instantiate a singleton by calling 'new' on this function

    var d = document,
      mars = {};

    // main flags
    mars.initialized = false;
    mars.gridSet = false;
    mars.gridSize = null;
    mars.robotScents = [];
    mars.robotOnGrid = false;
    mars.currentPositionX = null;
    mars.currentPositionY = null;
    mars.currentDirection = 'N';
    mars.currentTile = null;
    mars.wrap = null;

    /**
     *  @method init
     */
    mars.init = function (planetId) {
      mars.setPlanet(planetId);
      mars.setRobot();
      mars.initialized = true;
    };

    /**
     *  @method reset
     */
    mars.reset = function () {
      mars.gridSet = false;
      mars.gridSize = null;
      mars.robotScents = [];
      mars.robotOnGrid = false;
      mars.currentPositionX = null;
      mars.currentPositionY = null;
      mars.currentDirection = 'N';
      mars.currentTile = null;
      mars.wrap.empty();
    };

    /**
     *  @method setPlanet
     */
    mars.setPlanet = function (id) {
      mars.wrap = $('#' + id);
    };

    /**
     *  @method setRobot
     */
    mars.setRobot = function () {
      mars.robot = d.createElement('div');
      mars.robot.setAttribute('class', 'marsRobot');
      mars.robotIcon = '<img src="images/robot-icon.png">';
      mars.robot.innerHTML = mars.robotIcon;
    };

    /**
     *  @method buildSurface
     */
    mars.buildSurface = function (size) {
      size = size || $('#surfaceSize').val();
      if (!size || size === '') {
        return;
      }

      // check if already build
      if (mars.gridSet) {
        var build = $window.confirm('Reset current planet and related data?');
        if (!build) {
          return;
        }

        // reset planet
        mars.reset();
      }

      // remove space chars
      size = size.replace(/[ \t\r]+/g, '');

      // check if has correct structure
      if (!/^\d+,\d+$/.test(size)) {
        $window.alert('Wrong input, Example input: 4,6');
        return;
      }

      // clear input
      $('#surfaceSize').val('');

      // split sizes
      var sizeArray = size.split(',');
      mars.gridSize = size;
      mars.width = parseInt(sizeArray[0]);
      mars.height = parseInt(sizeArray[1]);

      if (mars.width === 0 || mars.height === 0) {
        $window.alert('Planet Zero?, Grid has to be at least 1,1 size');
        return;
      }

      // create rows and tiles
      for (var i = 0; i < mars.height; i++) {
        var row = d.createElement('div');
        $(row).addClass('marsRow');

        for (var j = 0; j < mars.width; j++) {
          var tile = d.createElement('div');
          $(tile).addClass('marsTile');
          if (j === mars.width - 1) {
            $(tile).addClass('lastTileR');
          }
          if (i === mars.height - 1) {
            $(tile).addClass('lastTileB');
          }
          row.appendChild(tile);
        }

        mars.wrap.append(row);
      }
      mars.gridSet = true;
    };

    /**
     *  @method placeRobot
     */
    mars.placeRobot = function (position) {
      position = position || $('#robotPosition').val();
      if (!position || position === '') {
        return;
      }

      if (!mars.gridSet) {
        $window.alert('No planet yet, first set the planet.');
        return;
      }

      // check if already build
      if (mars.robotOnGrid) {
        var confirmation = $window.confirm('Send home current robot and place new?');
        if (!confirmation) {
          return;
        }
      }

      // remove space chars
      position = position.replace(/[ \t\r]+/g, '');

      // check if has correct structure
      if (!/^\d+,\d+$/.test(position)) {
        $window.alert('Wrong input. Example: 2,4');
        return;
      }

      // clear input
      $('#robotPosition').val('');

      // slit into x & y
      var posArray = position.split(','),
        x = parseInt(posArray[0]),
        y = parseInt(posArray[1]);

      if (x < 0 || x > mars.width - 1 || y < 0 || y > mars.height - 1) {
        $window.alert('Position off Planet. Mars range: 0,0 to ' + (mars.width - 1) + ',' + (mars.height - 1));
        return;
      }

      mars.currentPositionX = x;
      mars.currentPositionY = y;
      mars.currentTile = mars.getTile(x, y);
      mars.robot.setAttribute('class', 'marsRobot lookN');
      mars.currentDirection = 'N';
      mars.currentTile.append(mars.robot);
      mars.robotOnGrid = true;
    };

    /**
     *  @method getTile
     */
    mars.getTile = function (x, y) {
      var tile = mars.wrap.find('.marsRow:nth-child(' + (mars.height - y) + ') .marsTile:nth-child(' + (x + 1) + ')');
      if (!tile) {
        return null;
      }
      return tile;
    };

    /**
     *  @method getCurrentLocation
     */
    mars.getCurrentLocation = function () {
      return mars.currentPositionX + ',' + mars.currentPositionY + ' ' + mars.currentDirection;
    };

    /**
     *  @method moveRobot
     */
    mars.moveRobot = function (sequence) {
      sequence = sequence || $('#moveSequence').val();
      if (!sequence || sequence === '') {
        return;
      }

      // chek if there is a robot
      if (!mars.robotOnGrid) {
        $window.alert('No robot on Mars yet? Place it ^^');
        return;
      }

      // remove space chars
      sequence = sequence.replace(/[ \t\r]+/g, '');
      sequence = sequence.toUpperCase();

      // check if has correct initial structure
      if (!/^[FRL]+$/.test(sequence)) {
        $window.alert('Wrong input. Use only F, L, R (f,l,r) letters for moving');
        return;
      }

      // clear input
      $('#moveSequence').val('');

      var i, moveResult = 'OK',
        moves = sequence.split(''),
        message,
        replace;

      // move if validated
      for (i = 0; i < moves.length; i++) {
        switch (moves[i]) {
          case 'F':
            moveResult = mars.moveRobotForward();
            break;
          case 'L':
            mars.moveRobotLeft();
            break;
          case 'R':
            mars.moveRobotRight();
            break;
          default:
            break;
        }

        if (moveResult === 'LOST') {
          message = 'LOST';
          mars.robotOnGrid = false;
          break;
        }

        if (moveResult === 'BLOCKED') {
          message = 'SAVED';
          break;
        }
      }

      // Output this sequence result
      mars.outputResult(message);

      // replace with new robot on last known position?
      if (moveResult === 'LOST') {
        replace = $window.confirm('Place new Robot on last location?');
        if (replace) {
          mars.placeRobot(mars.currentPositionX + ',' + mars.currentPositionY);
        }
      }
    };

    /**
     *  @method updateRobotPosition
     */
    mars.updateRobotPosition = function () {
      mars.currentTile = mars.getTile(mars.currentPositionX, mars.currentPositionY);
      mars.currentTile.append(mars.robot);
    };

    /**
     *  @method moveRobotForward
     */
    mars.moveRobotForward = function () {
      var moveResult = 'OK';

      switch (mars.currentDirection) {
        case 'N':
          if (mars.currentPositionY < mars.height - 1) {
            mars.currentPositionY += 1;
            mars.updateRobotPosition();
          } else {
            // Check if scented
            if (mars.robotScents.indexOf(mars.getCurrentLocation()) !== -1) {
              moveResult = 'BLOCKED';
              break;
            }
            moveResult = 'LOST';
            break;
          }
          break;
        case 'E':
          if (mars.currentPositionX < mars.width - 1) {
            mars.currentPositionX += 1;
            mars.updateRobotPosition();
          } else {
            // Check if scented
            if (mars.robotScents.indexOf(mars.getCurrentLocation()) !== -1) {
              moveResult = 'BLOCKED';
              break;
            }
            moveResult = 'LOST';
            break;
          }
          break;
        case 'S':
          if (mars.currentPositionY > 0) {
            mars.currentPositionY -= 1;
            mars.updateRobotPosition();
          } else {
            // Check if scented
            if (mars.robotScents.indexOf(mars.getCurrentLocation()) !== -1) {
              moveResult = 'BLOCKED';
              break;
            }
            moveResult = 'LOST';
            break;
          }
          break;
        case 'W':
          if (mars.currentPositionX > 0) {
            mars.currentPositionX -= 1;
            mars.updateRobotPosition();
          } else {
            // Check if scented
            if (mars.robotScents.indexOf(mars.getCurrentLocation()) !== -1) {
              moveResult = 'BLOCKED';
              break;
            }
            moveResult = 'LOST';
            break;
          }
          break;
        default:
          break;
      }

      // check results
      if (moveResult === 'LOST') {
        mars.addScent();
        mars.robot.remove();
        mars.robotOnGrid = false;
      }

      return moveResult;
    };

    /**
     *  @method moveRobotLeft
     */
    mars.moveRobotLeft = function () {
      switch (mars.currentDirection) {
        case 'N':
          mars.robot.setAttribute('class', 'marsRobot lookW');
          mars.currentDirection = 'W';
          break;
        case 'E':
          mars.robot.setAttribute('class', 'marsRobot lookN');
          mars.currentDirection = 'N';
          break;
        case 'S':
          mars.robot.setAttribute('class', 'marsRobot lookE');
          mars.currentDirection = 'E';
          break;
        case 'W':
          mars.robot.setAttribute('class', 'marsRobot lookS');
          mars.currentDirection = 'S';
          break;
        default:
          break;
      }
    };

    /**
     *  @method moveRobotRight
     */
    mars.moveRobotRight = function () {
      switch (mars.currentDirection) {
        case 'N':
          mars.robot.setAttribute('class', 'marsRobot lookE');
          mars.currentDirection = 'E';
          break;
        case 'E':
          mars.robot.setAttribute('class', 'marsRobot lookS');
          mars.currentDirection = 'S';
          break;
        case 'S':
          mars.robot.setAttribute('class', 'marsRobot lookW');
          mars.currentDirection = 'W';
          break;
        case 'W':
          mars.robot.setAttribute('class', 'marsRobot lookN');
          mars.currentDirection = 'N';
          break;
        default:
          break;
      }
    };

    /**
     *  @method addScent
     */
    mars.addScent = function () {
      var tile = mars.getTile(mars.currentPositionX, mars.currentPositionY);

      mars.robotScents.push(mars.getCurrentLocation());

      switch (mars.currentDirection) {
        case 'N':
          tile.addClass('safeN');
          break;
        case 'E':
          tile.addClass('safeE');
          break;
        case 'S':
          tile.addClass('safeS');
          break;
        case 'W':
          tile.addClass('safeW');
          break;
        default:
          break;
      }
    };

    /**
     *  @method outputResult
     */
    mars.outputResult = function (message) {
      message = message || '';

      $('#sequenceOutput').append('<p>' + mars.getCurrentLocation() + ' ' + message + '</p>');
    };

    // return constructed mars
    return mars;
  });
