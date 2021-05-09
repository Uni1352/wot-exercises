var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

var resources = require('../resources/model');
var routeCreator = require('../routes/routeCreator');
var converter = require('../middleware/converter');
var auth = require('../middleware/auth');

var app = express();

app.use(bodyParser.json());
app.use(cors()); // CORS support

if (resources.customFields.secure === true) {
  console.info(`My API Token is: ${keys.apiToken}`);
  app.use(auth()); // uncomment to enable the auth middleware
}

// create routes
app.use('/', routeCreator.create(resources));

app.use(converter());

module.exports = app;