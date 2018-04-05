const assert = require('assert');
const { distanceOnFoot } = require('../build/bundle.cjs');

assert.equal(distanceOnFoot(60), 5000);
