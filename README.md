# Robots On Mars test
version 1.0.5

## Demo Link:
[Click here to view](http://betweenart.co.uk/ppRobots/)

## Build & development
Run `grunt` for building and `grunt serve` for preview.

## Testing
Running `grunt test` will run the unit tests with karma.
Currently just setup with 2 basic tests.

## Description
Simple app that builds a grid for a robot.
Whole functionality is inside an angular service.

## What does it do
- Grid build for any size, with confirmation on destroying current
- Robot placement on chosen grid tile with off planet detection
- Confirmation when replacing robot if there is one already
- Movement sequence using F(forward), R(right), L(left) commands in the input
- Output of robot position after each sequence completion
- Scent/Security fence is build when robot goes/falls off the grid so new will be saved
- Alerts on wrong input with input example
- Grid position starts from 0,0 in the left bottom corner
- Simple input dependency angular-css animations
- Live update of grid input and robot position/direction
- Added init options to set custom robot image
- Method jDoc descriptions improved
