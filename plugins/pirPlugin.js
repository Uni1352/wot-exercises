const { gql } = require('@apollo/client/core');
const utils = require('../utils/utils');
const client = require('../db/client/client');

let model = require('../resources/model');
let pir = model.links.properties.resources.pir;

module.exports = {
  startPlugin,
  addValue
};

function startPlugin() {
  addValue(false);
}

function createValue(val) {
  return {
    'presence': val,
    'timestamp': new Date().toISOString()
  };
}

function addValue(val) {
  utils.cappedPush(pir.data, createValue(val));
  client.mutate(gql(`
    addPirData(presence:${val}){
      createAt
    }`));
}