const express = require('express');
const cors = require('cors');
const cons = require('consolidate');
const routeCreator = require('../routes/routeCreator');
const converter = require('../middleware/middleware').representationConverter;
const auth = require('../middleware/middleware').authorization;

let model = require('../resources/model');

const app = express();

// body parser
app.use(express.json());

// cors
app.use(cors());

// api token
if (model.customFields.secure === true) app.use(auth());

// bind routes
app.use('/', routeCreator(model));

// html template
app.engine('html', cons.handlebars);
app.set('view engine', 'html');
app.set('views', `${__dirname}/../views`);
app.use(express.static(`${__dirname}/../views`));

// representation converter
app.use(converter());

module.exports = app;