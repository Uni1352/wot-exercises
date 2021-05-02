const express = require('express');
const resources = require('../resources/model');

const router = express.Router();

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
});
// .put((req, res, next) => {
//   let selectedLed = resources.pi.actuators.leds[req.params.id];

//   selectedLed.value = req.body.value;
//   console.info(`Changed LED ${req.params.id} value to ${selectedLed.value}`);
//   req.result = selectedLed;
//   next();
// });

module.exports = router;