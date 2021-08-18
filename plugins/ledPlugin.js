const mqtt = require('../mqtt/mqtt');
const { gql } = require('@apollo/client/core');
const utils = require('../utils/utils');
const client = require('../db/client/client');

let model = require('../resources/model');
let leds = model.links.properties.resources.leds;
let currentVal = [false, false];

module.exports = {
  startPlugin
};

async function startPlugin(mode) {
  switch (mode) {
    case 'simulate':
      simulator();
      break;
    default:
      // model.links.actions.resources.ledState.data = new Proxy(model.links.actions.resources
      //   .ledState
      //   .data, {
      //     set: (arr, index, val) => {
      //       if (!isNaN(parseInt(index))) {
      //         console.info(`[Proxy] plugin action detected: ledState`);
      //         switchOnOff(val);
      //         arr[index] = val;
      //       }
      //       return true;
      //     }
      //   })
      // console.info(`[Proxy] ledState proxy created!`);
      await client
        .subscribe({
          query: gql(`subscription Subscription {
            newLedStateAction {
              _id
              status
              ledId
              state
              timestamp
            }
          }`),
          variables: {}
        })
        .subscribe({
          next: (data) => {
            console.info(`[Action] plugin action detected: ledState`);
            console.info(data.data.newLedStateAction);
            switchOnOff(data.data.newLedStateAction);
          },
          error: (err) => console.info(`[Error] Error Occurred: ${err}`)
        });
  }
}

function createValue(val) {
  return {
    "1": val[0],
    "2": val[1],
    "createAt": new Date().toISOString()
  };
}

async function addValue(val) {
  utils.cappedPush(leds.data, createValue(val));

  await client
    .mutate({
      mutation: gql(`mutation Mutation{
        addLedValue(one:${val[0]},two:${val[1]}){
          timestamp
        }
      }`)
    })
    .then(result => {
        console.info('[MongoDB] Insert Led Data Successfully!')
        console.info(`[MongoDB] Insert Time: ${result.data.addLedValue.timestamp}`);
      },
      err => console.info(`[MongoDB] Error ocurred: ${err}`));
}

async function switchOnOff(obj) {
  const publishData = {}

  publishData[obj.ledId] = obj.state;
  mqtt.publishTopic('/actions/ledState', JSON.stringify(publishData));

  currentVal[parseInt(obj.ledId) - 1] = obj.state;
  addValue(currentVal);
  obj.status = 'completed';

  await client
    .mutate({
      mutation: gql(`mutation Mutation{
        updateLedStateActionStatus(
          _id:"${obj._id}"
          status:"${obj.status}"
          timestamp:"${new Date().toISOString()}"){
            _id
        }
      }`)
    })
    .then(result => {
      console.info('[MongoDB] Update Action Data Successfully!');
      console.info(`[MongoDB] Action ID: ${result.data.updateLedStateActionStatus._id}`);
    });

  console.info(`[Info] Change value of LED ${obj.ledId} to ${obj.state}`);
}

function simulator() {
  let currentLedState = [false, true];

  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      addValue(currentLedState);
      currentLedState[1] = !currentLedState[1];
    }, i * 2000);
  }
}