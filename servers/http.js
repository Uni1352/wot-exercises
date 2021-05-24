const express = require('express');
const cors = require('cors');
const cons = require('consolidate');
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

// html template
app.engine('html', cons.handlebars);
app.set('view engine', 'html');
app.set('views', `${__dirname}/../views`);
app.use(express.static(`${__dirname}/../views/assets`));

// representation converter
app.use(converter());

module.exports = app;