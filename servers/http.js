const express = require('express');
const cors = require('cors');
const rootRoute = require('../routes/root');
const propertiesRoute = require('../routes/properties');
const actionsRoute = require('../routes/actions');
const routeCreator = require('../routes/routeCreator');
const converter = require('../middleware/middleware').representationConverter;

let model = require('../resources/model');

const app = express();

// body parser
app.use(express.json());

// cors
app.use(cors());

// bind routes
// app.use('/', rootRoute);
// app.use('/properties', propertiesRoute);
// app.use('/actions', actionsRoute);
app.use('/', routeCreator(model));

// representation converter
app.use(converter());

app.use(function (req, res, next) {
  res.status(404).send('Unable to find the requested resource!');
});

module.exports = app;