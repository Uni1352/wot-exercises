const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const resources = require('../resources/model');
const sensorRoutes = require('../routes/sensors');
const actuatorRoutes = require('../routes/actuators');
const converter = require('../middleware/converter');

const app = express();

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