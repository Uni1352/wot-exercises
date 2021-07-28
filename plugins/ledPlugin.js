const mqtt = require('../mqtt/mqtt');
const { gql } = require('@apollo/client/core');
const utils = require('../utils/utils');
const client = require('../db/client/client');

let model = require('../resources/model');
let leds = model.links.properties.resources.leds;

module.exports = {
  startPlugin
};

function startPlugin() {
  model.links.actions.resources.ledState.data = new Proxy(model.links.actions.resources.ledState
    .data, {
      set: (arr, index, val) => {
        if (!isNaN(parseInt(index))) {
          console.info(`[Proxy] plugin action detected: ledState`);
          switchOnOff(val);
          arr[index] = val;
        }
        return true;
      }
    })
  console.info(`[Proxy] ledState proxy created!`);

  addValue([false, false]);
}

function createValue(val) {
  return {
    "1": val[0],
    "2": val[1],
    "createAt": new Date().toISOString()
  };
}

function addValue(val) {
  utils.cappedPush(leds.data, createValue(val));
  // client.mutate({
  //   mutation: gql(`mutation Mutation{
  //     addLedData(one:${val[0]},two:${val[1]}){
  //       createAt
  //     }
  //   }`)
  // });
}

function switchOnOff(obj) {
  const target = leds.data[leds.data.length - 1];
  const latestVal = [target['1'], target['2']];
  const publishData = {}

  publishData[obj.values.ledId] = obj.values.state;
  mqtt.publishTopic('/actions/ledState', JSON.stringify(publishData));

  latestVal[parseInt(obj.values.ledId) - 1] = obj.values.state;
  addValue(latestVal);

  // await client.mutate({
  //   mutation: gql(`mutation Mutation{
  //     updateLedStateAction(id:${obj.id},status:${obj.status}){
  //       id
  //     }
  //   }`)
  // });

  obj.status = 'completed';
  console.info(`[Info] Change value of LED ${obj.values.ledId} to ${obj.values.state}`);
}