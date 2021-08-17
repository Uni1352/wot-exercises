const uuid = require('uuid');
const router = require('express').Router();
const { gql } = require('@apollo/client');
const client = require('../db/client/client');
const utils = require('../utils/utils');

module.exports = (model) => {
  createDefaultData(model.links.properties.resources);
  createDefaultData(model.links.actions.resources);

  createRootRoute(model);
  createModelRoute(model);
  createPropertiesRoute(model);
  createActionsRoute(model);
  createThingsRoute(model);

  return router;
};

function createRootRoute(model) {
  // GET {wt}
  router.route('/').get((req, res, next) => {
    let fields = ['id', 'name', 'description', 'tags', 'customFields'];
    let type;

    req.model = model;
    req.type = 'root';
    req.result = utils.extractFields(fields, model);

    if (model['@context']) type = model['@context'];
    else type = 'http://model.webofthings.io/';

    res.links({
      model: '/model/',
      properties: '/properties/',
      actions: '/actions/',
      things: '/things/',
      help: '/help/',
      ui: '/',
      type: type
    });

    next();
  });
}

function createModelRoute(model) {
  // GET {WT}/model
  router.route('/model').get((req, res, next) => {
    let type;

    req.result = model;
    // req.type = 'model';

    if (model['@context']) type = model['@context'];
    else type = 'http://model.webofthings.io/';

    res.links({
      type: type
    });

    next();
  });
}

function createPropertiesRoute(model) {
  let properties = model.links.properties;
  let type;

  // GET {WT}/properties
  router.route(properties.link).get(async (req, res, next) => {
    req.model = model;
    req.type = 'properties';
    req.entityId = 'properties';
    req.result = utils.modelToResource(properties.resources, false);

    await client
      .query({
        query: gql(`query Query {
          pirValues(num:1){
            presence
            timestamp
          }
          ledValues(num:1){
            one
            two
            timestamp
          }
        }`)
      })
      .then(result => {
          for (let obj of req.result) {
            switch (obj.id) {
              case 'pir':
                obj.values = result.data.pirValues;
                break;
              case 'leds':
                obj.values = result.data.ledValues;
                break;
            }
          }
          console.info('[MongoDB] Get Data Successfully!');
        },
        err => console.info(`[MongoDB] Error ocurred: ${err}`))
      .finally(() => console.info('[MongoDB] Done'));

    if (properties['@context']) type = properties['@context'];
    else type = 'http://model.webofthings.io/#properties-resource';

    res.links({
      type: type
    });

    next();
  });

  // GET {WT}/properties/{id}
  router.route(`${properties.link}/:id`).get(async (req, res, next) => {
    req.model = model;
    req.propertyModel = properties.resources[req.params.id];
    req.type = 'property';
    req.entityId = req.params.id;

    switch (req.params.id) {
      case 'pir':
        await client
          .query({
            query: gql(`query Query {
              pirValues {
                presence
                timestamp
              }
            }`)
          })
          .then(result => {
              req.result = result.data.pirValues;
              console.info('[MongoDB] Get Data Successfully!');
            },
            err => console.info(`[MongoDB] Error ocurred: ${err}`))
          .finally(() => console.info('[MongoDB] Done'));
        break;
      case 'leds':
        await client
          .query({
            query: gql(`query Query {
              ledValues {
                one
                two
                timestamp
              }
            }`)
          })
          .then(result => {
              req.result = result.data.ledValues;
              console.info('[MongoDB] Get Data Successfully!');
            },
            err => console.info(`[MongoDB] Error ocurred: ${err}`))
          .finally(() => console.info('[MongoDB] Done'));
        break;
    }

    if (properties.resources[req.params.id]['@context']) type = properties.resources[req
      .params.id]['@context'];
    else type = 'http://model.webofthings.io/#properties-resource';

    res.links({
      type: type
    });

    next();
  });
}

function createActionsRoute(model) {
  let actions = model.links.actions;
  let type;

  // GET {WT}/actions
  router.route(actions.link).get(async (req, res, next) => {
    req.model = model;
    req.type = 'actions';
    req.entityId = 'actions';
    req.result = utils.modelToResource(actions.resources, false);

    await client
      .query({
        query: gql(`query Query {
          ledStateActions(num:1){
            _id
            status
            timestamp
            ledId
            state
          }
        }`)
      })
      .then(result => {
          for (let obj of req.result) {
            switch (obj.id) {
              case 'ledState':
                obj.values = result.data.ledStateActions;
                break;
            }
          }
          console.info('[MongoDB] Get Data Successfully!');
        },
        err => console.info(`[MongoDB] Error ocurred: ${err}`))
      .finally(() => console.info('[MongoDB] Done'));

    if (actions['@context']) type = actions['@context'];
    else type = 'http://model.webofthings.io/#actions-resource';

    res.links({
      type: type
    });

    next();
  });

  // GET & POST{WT}/actions/{id}
  router.route(`/actions/:actionType`)
    .get(async (req, res, next) => {
      req.model = model;
      req.actionModel = actions.resources[req.params.actionType];
      req.type = 'action';
      req.entityId = req.params.actionType;

      await client
        .query({
          query: gql(`query Query {
            ledStateActions {
              _id
              status
              timestamp
              ledId
              state
            }
          }`)
        })
        .then(result => {
            req.result = result.data.ledStateActions;
            console.info('[MongoDB] Get Data Successfully!');
          },
          err => console.info(`[MongoDB] Error ocurred: ${err}`))
        .finally(() => console.info('[MongoDB] Done'));

      // req.result = reverseResults(actions.resources[req.params.actionType].data);

      if (actions.resources[req.params.actionType]['@context']) type = actions.resources[req
        .params.actionType]['@context'];
      else type = 'http://model.webofthings.io/#actions-resource';

      res.links({
        type: type
      });

      next();
    })
    .post((req, res, next) => {
      // let action = {};

      // action._id = uuid.v1();
      // action.values = req.body;
      // action.status = 'pending';
      // action.timestamp = utils.getISOTimestamp();
      // utils.cappedPush(actions.resources[req.params.actionType].data, action);

      client
        .mutate({
          mutation: gql(`mutation Mutation{
            addLedStateAction(
              status: "pending"
              ledId: "${req.body.ledId}"
              state: ${req.body.state}){
                _id
            }
          }`)
        })
        .then(result => {
          console.info('[MongoDB] Insert Data Successfully!');
          res.location(`${req.originalUrl}/${result.data.addLedStateAction._id}`);
          res.status(204).send();
        }, err => console.info(`[MongoDB] Error ocurred: ${err}`))
        .finally(() => console.info('[MongoDB] Done'));

      // next();
      return;
    });

  // GET /actions/{id}/{actionId}
  router.route(`${actions.link}/:actionType/:actionId`).get(async (req, res, next) => {
    // req.result = utils.findObjInArr(actions.resources[req.params.actionType].data, {
    //   '_id': req.params.actionId
    // }); ${req.params.actionId}

    await client
      .query({
        query: gql(`query Query {
          targetLedStateAction(_id:"${req.params.actionId}") {
            _id
            status
            timestamp
            ledId
            state
          }
        }`)
      })
      .then(result => {
          req.result = result.data.targetLedStateAction;
          console.info('[MongoDB] Get Data Successfully!');
        },
        err => console.info(`[MongoDB] Error ocurred: ${err}`))
      .finally(() => console.info('[MongoDB] Done'));

    next();
  });
}

function createThingsRoute(model) {
  let things = model.links.things;
  let type;

  router.route(things.link)
    .get((req, res, next) => {
      req.model = model;
      req.type = 'things';
      req.entityId = 'things';

      if (things.resources) {
        req.result = utils.modelToResource(things.resources, false);
      } else req.result = [];

      if (model['@context']) type = model['@context'];
      else type = 'http://model.webofthings.io/#things-resource';

      res.links({
        type: type
      });

      next();
    })
    .post((req, res, next) => {
      let thing = req.body;

      if (!thing.id) thing.id = uuid.v1();

      utils.addThingToModel(thing);
      res.location(`${req.originalUrl}/${thing.id}`);

      next();
    });

  router.route(`${things.link}/:id`)
    .get((req, res, next) => {
      let fields = ['id', 'name', 'description', 'rootUrl', 'tags'];
      let thingModel = things.resources[req.params.id];
      let type;

      thingModel.id = req.params.id;

      req.model = model;
      req.type = 'thing';
      req.entityId = req.params.id;
      req.result = utils.extractFields(fields, thingModel);

      if (model['@context']) type = model['@context'];
      else type = 'http://model.webofthings.io/#things-resource';

      res.links({
        type: type
      });

      next();
    });
}

function createDefaultData(resources) {
  Object.keys(resources).forEach(function(resKey) {
    var resource = resources[resKey];
    resource.data = [];
  });
}

function reverseResults(array) {
  return array.slice(0).reverse();
}