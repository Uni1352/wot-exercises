const model = require('../resources/model');

const router = require('express').Router();

router.route('/coapDevice/sensors/co2').get((req, res, next) => {
  req.result = model.things.coapDevice.sensors.co2;
  next();
});

module.exports = router;