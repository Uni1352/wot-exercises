const mqtt = require('../mqtt/mqtt');
const utils = require('../utils/utils');

let model = require('../resources/model');

let pir = model.links.properties.resources.pir;

module.exports = {
  pluginInit,
  addValue
};

function pluginInit() {
  mqtt.subscribeTopic('/properties/pir');
}

function createValue(val) {
  return {
    'presence': val,
    'timestamp': new Date().toISOString()
  };
}

function addValue(val) {
  utils.cappedPush(pir.data, createValue(val));
}