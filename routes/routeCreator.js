const uuid = require('uuid');
const router = require('express').Router();
const utils = require('../utils/utils');

function createRootRoute(model) {
  // GET {wt}
  router.route('/').get((req, res, next) => {
    let fields = ['id', 'name', 'description', 'tags', 'customFields'];

    req.model = model;
    req.type = 'root';
    req.result = utils.extractFields(fields, model);
    res.links({
      model: '/model/',
      properties: '/properties/',
      actions: '/actions/',
      things: '/things/',
      help: '/help/',
      ui: '/',
      type: 'http://model.webofthings.io/'
    });

    next();
  });
}

function createModelRoute(model) {
  // GET {WT}/model
  router.route('/model').get((req, res, next) => {
    req.result = model;
    req.type = 'model';
    res.links({
      type: 'http://model.webofthings.io/'
    });

    next();
  });
}

function createPropertiesRoute(model) {
  let properties = model.links.properties;

  // GET {WT}/properties
  router.route(properties.link).get((req, res, next) => {
    req.model = model;
    req.type = 'properties';
    req.entityId = 'properties';
    req.result = utils.modelToResource(properties.resources, true);
    res.links({
      type: 'http://model.webofthings.io/#properties-resource'
    });

    next();
  });

  // GET {WT}/properties/{id}
  router.route(`${properties.link}/:id`).get((req, res, next) => {
    req.model = model;
    req.propertyModel = properties.resources[req.params.id];
    req.type = 'property';
    req.entityId = req.params.id;
    req.result = reverseResults(properties.resources[req.params.id].data);
    res.links({
      type: 'http://model.webofthings.io/#properties-resource'
    });

    next();
  });
}

function createActionsRoute(model) {
  let actions = model.links.actions;

  // GET {WT}/actions
  router.route(actions.link).get((req, res, next) => {
    req.model = model;
    req.type = 'actions';
    req.entityId = 'actions';
    req.result = utils.modelToResource(actions.resources, true);
    res.links({
      type: 'http://model.webofthings.io/#actions-resource'
    });

    next();
  });

  // POST {WT}/actions/{id}
  router.route(`/actions/:actionType`).post((req, res, next) => {
    let action = {};

    action.id = uuid.v1();
    action.values = req.body;
    action.status = 'pending';
    action.timestamp = utils.isoTimestamp();

    utils.cappedPush(actions.resources[req.params.actionType].data, action);
    // console.info(actions.resources[req.params.actionType].data);
    // console.info(req.url);
    res.location(`${req.originalUrl}/${action.id}`);

    next();
  });

  // GET {WT}/actions/{id}
  router.route(`/actions/:actionType`).get((req, res, next) => {
    req.model = model;
    req.actionModel = actions.resources[req.params.actionType];
    req.type = 'action';
    req.entityId = req.params.actionType;
    req.result = reverseResults(actions.resources[req.params.actionType].data);
    res.links({
      type: 'http://model.webofthings.io/#actions-resource'
    });

    next();
  });

  // GET /actions/{id}/{actionId}
  router.route(`${actions.link}/:actionType/:actionId`).get((req, res, next) => {
    req.result = utils.findObjInArr(actions.resources[req.params.actionType].data, {
      'id': req.params.actionId
    });

    next();
  });
}

function createDefaultData(resources) {
  Object.keys(resources).forEach(function (resKey) {
    var resource = resources[resKey];
    resource.data = [];
  });
}

function reverseResults(array) {
  return array.slice(0).reverse();
}

module.exports = (model) => {
  createDefaultData(model.links.properties.resources);
  createDefaultData(model.links.actions.resources);

  createRootRoute(model);
  createModelRoute(model);
  createPropertiesRoute(model);
  createActionsRoute(model);

  return router;
};