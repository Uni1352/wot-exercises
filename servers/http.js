const express = require('express');
const cors = require('cors');

const model = require('../resources/model');
const sensorRoute = require('../routes/sensors');
const actuatorRoute = require('../routes/actuators');
const thingRoute = require('../routes/things');
const createRootRoute = require('../routes/routeCreator').createRootRoute;
const converter = require('../middleware/middleware').representationConverter;

const app = express();

// body parser
app.use(express.json());

// cors
app.use(cors());

// bind routes
app.use('/', createRootRoute(model));
// app.use('/pi/sensors', sensorRoute);
// app.use('/pi/actuators', actuatorRoute);
// app.use('/things', thingRoute);

app.get('/pi', (req, res) => res.send('THIS IS WOT-PI!'));

// representation converter
app.use(converter());

module.exports = app;