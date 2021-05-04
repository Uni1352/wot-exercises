var express = require('express');
var resources = require('../resources/model');

var router = express.Router();

router.route('/coapDevice/sensors/co2').get((req, res, next) => {
  req.result = resources.things.coapDevice.sensors.co2;
  next();
});

module.exports = router;