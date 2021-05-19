const express = require('express');
const cors = require('cors');

const routes = require('../routes/routeCreator');
const converter = require('../middleware/middleware').representationConverter;

const app = express();

// body parser
app.use(express.json());

// cors
app.use(cors());

// bind routes
app.use('/', routes);

// representation converter
app.use(converter());

module.exports = app;