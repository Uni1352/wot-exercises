const router = require('express').Router();
const utils = require('../utils/utils');

let model = require('../resources/model');
let properties = model.links.properties;

utils.createDefaultData(properties.resources);

// GET {WT}/properties
router.route('/').get((req, res, next) => {
  req.type = 'properties';
  req.entityId = 'properties';
  req.result = utils.modelToResource(properties.resources, true);
  res.links({
    type: 'http://model.webofthings.io/#properties-resource'
  });

  next();
});

// GET {WT}/properties/{id}
router.route(`/:id`).get((req, res, next) => {
  req.type = 'property';
  req.entityId = req.params.id;
  req.result = utils.reverseResults(properties.resources[req.params.id].data);
  res.links({
    type: 'http://model.webofthings.io/#properties-resource'
  });

  next();
});

module.exports = router;