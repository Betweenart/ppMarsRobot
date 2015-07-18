'use strict';

describe('Service: marsAdventure', function () {

  // load the service's module
  beforeEach(module('robotsOnMarsApp'));

  // instantiate service
  var marsAdventure;
  beforeEach(inject(function (_marsAdventure_) {
    marsAdventure = _marsAdventure_;
  }));

  it('should return mars service', function () {
    expect(!!marsAdventure).toBe(true);
  });

});
