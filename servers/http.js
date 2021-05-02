const express = require('express');
const cors = require('cors');
const sensorRoutes = require('../routes/sensors');
const actuatorRoutes = require('../routes/actuators');
const resources = require('../resources/model');

const app = express();

// CORS support
app.use(cors());

// bind route to Express program
app.use('/pi/sensors', sensorRoutes);
app.use('/pi/actuators', actuatorRoutes);

// default route
app.get('/pi', (req, res) => {
  res.send('This is the WoT-Pi');
});

module.exports = app;