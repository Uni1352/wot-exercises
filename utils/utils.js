var crypto = require('crypto');

var model = require('../resources/model');

exports.addDevice = function (id, name, description, sensors, actuators) {
  if (!model.things) {
    model.things = {};
  }
  model.things[id] = {
    'name': name,
    'description': description,
    'sensors': sensors,
    'actuators': actuators
  }
};

exports.extractFields = function (fields, object, target) {
  if (!target) var target = {};
  var arrayLength = fields.length;
  for (var i = 0; i < arrayLength; i++) {
    var field = fields[i];
    target[field] = object[field];
  }
  return target;
};

exports.modelToResources = function (subModel, withValue) {
  var resources = [];
  Object.keys(subModel).forEach(function (key) {
    var val = subModel[key];
    var resource = {};
    resource.id = key;
    resource.name = val['name'];
    if (withValue) resource.values = val.data[val.data.length - 1];
    resources.push(resource);
  });
  return resources;
};

exports.isoTimestamp = function () {
  var date = new Date();
  return date.toISOString();
};

exports.generateApiToken = (length, chars) => {
  if (!length) length = 32;
  if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';

  var randomBytes = crypto.randomBytes(length);
  var result = new Array(length);
  var cursor = 0;

  for (var i = 0; i < length; i++) {
    cursor += randomBytes[i];
    result[i] = chars[cursor % chars.length];
  }

  return result.join('');
};