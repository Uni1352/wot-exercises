const express = require('express');
const router = express.Router();

let resources = require('../resources/model');

router.route('/').get((req, res, next) => {
  req.result = resources.pi.actuators;
  next();
});

router.route('/leds').get((req, res, next) => {
  req.result = resources.pi.actuators.leds;
  next();
});

router.route('/leds/:id').get((req, res, next) => {
  req.result = resources.pi.actuators.led[req.params.id];
  next();
}).put((req, res, next) => {
  let selectedLed = resources.pi.actuators.leds[req.params.id];

  console.info(`Origin Value: ${selectedLed.value}`);
  console.info(`Request Value: ${req.body.value}`);
  selectedLed.value = req.body.value;

  console.info(`Changed LED ${req.params.id} value to ${selectedLed.value}`);
  req.result = selectedLed;
  next();
});

module.exports = router;