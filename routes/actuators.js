const express = require('express');
const model = require('../resources/model');

const router = express.Router();

router.route('/').get((req, res, next) => res.send(model.pi.actuators));
router.route('/leds').get((req, res, next) => res.send(model.pi.actuators.leds));
router.route('/leds/:id').get((req, res, next) => res.send(model.pi.actuators.leds[req.params.id]));

module.exports = router;