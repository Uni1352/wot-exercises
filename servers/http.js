const express = require('express');

const model = require('../resources/model');
const sensorRoute = require('../routes/sensors');
const actuatorRoute = require('../routes/actuators');
const converter = require('../middleware/middleware').representationConverter;

const app = express();

app.use('/pi/sensors', sensorRoute);
app.use('/pi/actuators', actuatorRoute);

app.get('/pi', (req, res) => res.send('THIS IS WOT-PI!'));

app.use(converter());

module.exports = app;