const router = require('express').Router();
const utils = require('../utils/utils');
const model = require('../resources/model');

// GET {wt}
router.route('/').get((req, res, next) => {
  let fields = ['id', 'name', 'description', 'tags', 'customFields'];

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

// GET {WT}/model
router.route('/model').get((req, res, next) => {
  req.type = 'model';
  req.result = model;
  res.links({
    type: 'http://model.webofthings.io/'
  });

  next();
});

module.exports = router;