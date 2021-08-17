const { gql } = require('@apollo/client/core');
const utils = require('../utils/utils');
const client = require('../db/client/client');

let model = require('../resources/model');
let pir = model.links.properties.resources.pir;

module.exports = {
  startPlugin,
  addValue
};

function startPlugin(mode) {
  switch (mode) {
    case 'simulate':
      let currentState = false;

      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          addValue(currentState);
          currentState = !currentState;
        }, 3000);
      }
      break;
    default:
      addValue(false);
  }
}

function createValue(val) {
  return {
    'presence': val,
    'timestamp': new Date().toISOString()
  };
}

async function addValue(val) {
  utils.cappedPush(pir.data, createValue(val));

  await client
    .mutate({
      mutation: gql(`mutation Mutation{
        addPirValue(presence:${val}){
          timestamp
        }
      }`)
    })
    .then(result => {
        console.info('[MongoDB] Insert Data Successfully!')
        console.info(`[MongoDB] Insert Time: ${result.data.addPirValue.timestamp}`);
      },
      err => console.info(`[MongoDB] Error ocurred: ${err}`))
    .finally(() => console.info('[MongoDB] Done'));
}