const uuid = require('uuid');
const router = require('express').Router();

const extractFields = require('../utils/utils').extractFields;
const moduleToResource = require('../utils/utils').modelToResource;

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

  // GET {WT}/actions/{actionType}
  router.route(`${actions.link}/:actionType`).get((req, res, next) => {
    req.type = 'action';
    req.entityId = req.params.actionType;
    req.result = reverseResults(actions.resources[req.params.actionType].data);
    res.links({
      type: 'http://model.webofthings.io/#actions-resource'
    });

    next();
  });

  // POST {WT}/actions/{id}
  router.route(`${actions.link}/:id`).post((req, res, next) => {
    const action = req.body;

    action.id = uuid.v1();
    action.status = 'pending';
    action.timestamp = new Date().toISOString();

    actions.resources[req.params.id].data.push(action);
    res.location(`${req.originalUrl}/${action.id}`);

    next();
  });
}

function reverseResults(array) {
  return array.slice(0).reverse();
}

module.exports = (model) => {
  createRootRoute(model);
  createModelRoute(model);
  createPropertiesRoute(model);
  // createActionsRoute(model);

  return router;
};