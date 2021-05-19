const uuid = require('uuid');
const router = require('express').Router();

const extractFields = require('../utils/utils').extractFields;
const moduleToResource = require('../utils/utils').modelToResource;
const cappedPush = require('../utils/utils').cappedPush;

function createRootRoute(model) {
  // GET {WT}
  router.route('/').get((req, res, next) => {
    let fields = ['id', 'name', 'description', 'tags', 'customFields'];

    req.type = 'root';
    req.result = extractFields(fields, model);
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
    req.type = 'model';
    req.result = model;
    res.links({
      type: 'http://model.webofthings.io/'
    });

    next();
  });
}

function createPropertiesRoute(model) {
  const properties = model.links.properties;

  // GET {WT}/properties
  router.route(properties.link).get((req, res, next) => {
    req.type = 'properties';
    req.entityId = 'properties';
    req.result = moduleToResource(properties.resources, true);
    res.links({
      type: 'http://model.webofthings.io/#properties-resource'
    });

    next();
  });

  // GET {WT}/properties/{id}
  router.route(`${properties.link}/:id`).get((req, res, next) => {
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
  const actions = model.links.actions;

  // GET {WT}/actions
  router.route(actions.link).get((req, res, next) => {
    req.type = 'actions';
    req.entityId = 'actions';
    req.result = moduleToResource(actions.resources, true);
    res.links({
      type: 'http://model.webofthings.io/#actions-resource'
    });

    next();
  });

  // {WT}/actions/{id}
  router.route(`${actions.link}/:id`).get((req, res, next) => {
    req.type = 'action';
    req.entityId = req.params.id;
    req.result = reverseResults(actions.resources[req.params.id].data);
    res.links({
      type: 'http://model.webofthings.io/#actions-resource'
    });

    next();
  }).post(function (req, res, next) {
    var action = req.body;
    action.id = uuid.v1();
    action.status = "pending";
    action.timestamp = new Date().toISOString();
    cappedPush(actions.resources[req.params.actionType].data, action);
    res.location(req.originalUrl + '/' + action.id);

    next();
  });;

  // POST {WT}/actions/{id}
  // router.route(`${actions.link}/:id`).post((req, res, next) => {
  //   let action = {};

  //   action.id = uuid.v1();
  //   action.values = req.body;
  //   action.status = 'pending';
  //   action.timestamp = new Date().toISOString();

  //   console.info(req.params.id);
  //   console.info(action);

  //   actions.resources[req.params.id].data.push(action);
  //   // cappedPush(actions.resources[req.params.id].data, action);
  //   res.location(`${req.originalUrl}/${action.id}`);

  //   next();
  // });
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