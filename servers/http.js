var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var resources = require('../resources/model');
var sensorRoutes = require('../routes/sensors');
var actuatorRoutes = require('../routes/actuators');
var converter = require('../middleware/converter');

var app = express();

app.use(bodyParser.json());
app.use(cors()); // CORS support

// bind route to Express program
app.use('/pi/sensors', sensorRoutes);
app.use('/pi/actuators', actuatorRoutes);

// default route
app.get('/pi', (req, res) => {
  res.send('This is the WoT-Pi');
});

app.use(converter());

module.exports = app;