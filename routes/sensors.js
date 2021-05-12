const express = require('express');
const model = require('../resources/model');

const router = express.Router();

router.route('/').get((req, res, next) => res.send(model.pi.sensors));
router.route('/:deviceName').get((req, res, next) => res.send(model.pi.sensors[req.params.deviceName]));

module.exports = router;