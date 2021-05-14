const express = require('express');
const model = require('../resources/model');

const router = express.Router();

router.route('/').get((req, res, next) => {
  req.result = model.pi.actuators;
  next();
});

router.route('/leds').get((req, res, next) => {
  req.result = model.pi.actuators.leds;
  next();
});

router.route('/leds/:id').get((req, res, next) => {
  req.result = model.pi.actuators.leds[req.params.id];
  next();
});

module.exports = router;