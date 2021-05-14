const router = require('express').Router();

let model = require('../resources/model');


router.route('/').get((req, res, next) => {
  req.result = model.pi.actuators;
  next();
});

router.route('/leds').get((req, res, next) => {
  req.result = model.pi.actuators.leds;
  next();
});

router.route('/leds/:id')
  .get((req, res, next) => {
    req.result = model.pi.actuators.leds[req.params.id];
    next();
  })
  .put((req, res, next) => {
    let target = model.pi.actuators.leds[req.params.id];

    target.value = req.body.value;
    console.info(`Changed LED ${req.params.id} value to ${target.value}`);
    req.result = target;
    next();
  });

module.exports = router;