const express = require('express');
const cors = require('cors');
const cons = require('consolidate');
const routeCreator = require('../routes/routeCreator');
const converter = require('../middleware/middleware').representationConverter;
const generateApiToken = require('../utils/utils').generateApiToken;

let model = require('../resources/model');

const app = express();

// body parser
app.use(express.json());

// cors
app.use(cors());

console.info(`Here is a new random crypto-secure API Key: ${generateApiToken()}`);

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