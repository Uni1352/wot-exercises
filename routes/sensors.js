const express = require('express');
const model = require('../resources/model');

const router = express.Router();

router.route('/').get((req, res, next) => {
  req.result = model.pi.sensors;
  next();
});

router.route('/:deviceName').get((req, res, next) => {
  req.result = model.pi.sensors[req.params.deviceName];
  next();
});

module.exports = router;