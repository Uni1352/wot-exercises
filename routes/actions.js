const uuid = require('uuid');
const router = require('express').Router();
const utils = require('../utils/utils');

let model = require('../resources/model');
let actions = model.links.actions;

utils.createDefaultData(actions.resources);

// GET {WT}/actions
router.route('/').get((req, res, next) => {
  req.type = 'actions';
  req.entityId = 'actions';
  req.result = utils.modelToResource(actions.resources, true);
  res.links({
    type: 'http://model.webofthings.io/#actions-resource'
  });

  next();
});

// GET & POST {WT}/actions/{id}
router.route(`/:actionType`)
  .get((req, res, next) => {
    req.type = 'action';
    req.entityId = req.params.actionType;
    req.result = utils.reverseResults(actions.resources[req.params.actionType].data);
    res.links({
      type: 'http://model.webofthings.io/#actions-resource'
    });

    next();
  })
  .post((req, res, next) => {
    let action = {};

    action.id = uuid.v1();
    action.values = req.body;
    action.status = 'pending';
    action.timestamp = new Date().toISOString();

    utils.cappedPush(actions.resources[req.params.actionType].data, action);

    console.info(actions.resources[req.params.actionType].data);
    res.location(`${req.originalUrl}/${action.id}`);

    next();
  });

// GET /actions/{id}/{actionId}
router.route(`/:actionType/:actionId`).get((req, res, next) => {
  req.result = utils.findObjInArr(actions.resources[req.params.actionType].data, {
    'id': req.params.actionId
  });

  next();
});

module.exports = router;