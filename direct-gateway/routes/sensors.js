var express = require('express');
var resources = require('../resources/model');

var router = express.Router();

router.route('/').get((req, res, next) => {
  req.result = resources.pi.sensors;
  next();
});

router.route('/pir').get((req, res, next) => {
  req.result = resources.pi.sensors.pir;
  next();
});

router.route('/temperature').get((req, res, next) => {
  req.result = resources.pi.sensors.temperature;
  next();
});

router.route('/humidity').get((req, res, next) => {
  req.result = resources.pi.sensors.humidity;
  next();
});

module.exports = router;