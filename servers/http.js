const express = require('express');
const cors = require('cors');

const model = require('../resources/model');
const routeCreator = require('../routes/routeCreator');
const converter = require('../middleware/middleware').representationConverter;

const app = express();

// body parser
app.use(express.json());

// cors
app.use(cors());

// bind routes
app.use('/', routeCreator(model));

// representation converter
app.use(converter());

module.exports = app;