var express = require('express');
var uuid = require('node-uuid');
var utils = require('../utils/utils');

var router = express.Router();

function createRootRoute(model) {
  router.route('/').get((req, res, next) => {
    var type = 'http://model.webofthings.io/';
    var fields = ['id', 'name', 'description', 'tags', 'customFields'];

    res.links({
      model: '/model/',
      properties: '/properties/',
      actions: '/actions/',
      things: '/things/',
      type: type
    });
    req.result = utils.extractFields(fields, model);

    next();
  });
}

function createActionsRoutes(model) {
  var actions = model.links.actions;

  router.route(actions.link).get((req, res, next) => {
    req.type = 'actions';
    req.entityId = 'actions';

    res.links({
      type: 'http://model.webofthings.io/#actions-resource'
    });

    req.result = utils.modelToResources(actions.resources, true);
    next();
  });

  router.route(`${actions.link}/:actionType`).post((req, res, next) => {
    var action = req.body;

    action.id = uuid.v1();
    action.timestamp = utils.isoTimestamp();
    action.status = 'pending';
    actions.resources[req.params.actionType].data.push(action);

    res.location(`${req.originalUrl}/${action.id}`);
    next();
  });
}