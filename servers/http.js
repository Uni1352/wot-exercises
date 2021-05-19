const express = require('express');
const cors = require('cors');
const con = require('consolidate');

const routeCreator = require('../routes/routeCreator');
const converter = require('../middleware/middleware').representationConverter;

let model = require('../resources/model');

const app = express();

// body parser
app.use(express.json());

// cors
app.use(cors());

// bind routes
app.use('/', routeCreator(model));

// Template engine
app.engine('html', con.handlebars);
app.set('view engine', 'html');
app.set('views', __dirname + '/../views');

// representation converter
app.use(converter());

module.exports = app;