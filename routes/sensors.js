const express = require('express');
const resources = require('../resources/model');

const router = express.Router();

router.route('/').get((req, res, next) => {
  res.send(resources.pi.sensors);
  // req.result = resources.pi.sensors;
  // next();
});

router.route('/pir').get((req, res, next) => {
  res.send(resources.pi.sensors.pir);
  // req.result = resources.pi.sensors.pir;
  // next();
});

router.route('/temperature').get((req, res, next) => {
  res.send(resources.pi.sensors.temperature);
  // req.result = resources.pi.sensors.temperature;
  // next();
});

router.route('/humidity').get((req, res, next) => {
  res.send(resources.pi.sensors.humidity);
  // req.result = resources.pi.sensors.humidity;
  // next();
});

module.exports = router;