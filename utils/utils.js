const crypto = require('crypto');
const { gql } = require('@apollo/client');
const client = require('../db/client/client');

let model = require('../resources/model');

module.exports = {
  extractFields,
  modelToResource,
  getISOTimestamp,
  cappedPush,
  addThingToModel,
  findObjInArr: (arr, filter) => {
    return arr.find((obj) => obj.id === filter.id);
  },
  findProperty: (propId) => model.links.properties.resources[propId],
  generateApiToken: (length, chars) => {
    if (!length) length = 32;
    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    let randomBytes = crypto.randomBytes(length);
    let token = new Array(length);
    let cursor = 0;

    for (let i = 0; i < length; i++) {
      cursor += randomBytes[i];
      token[i] = chars[cursor % chars.length];
    }

    return token.join('');
  }
};

function extractFields(fields, object, target) {
  if (!target) target = {};
  for (let field of fields) {
    if (object[field]) target[field] = object[field];
  };

  return target;
}

async function modelToResource(subModel, withValue) {
  let resources = [];
  let resource = {};


  await Object.keys(subModel).forEach(async (key) => {
    let val = subModel[key];

    resource.id = key;
    resource.name = val['name'];

    console.info(resource);

    if (val['description']) resource.description = val['description'];
    if (withValue) {
      switch (key) {
        case 'pir':
          await client
            .query({
              query: gql(`query Query {
                pirValues(num:1){
                  presence
                  timestamp
                }
              }`)
            })
            .then(result => {
                resource.values = result.data.pirValues;
                console.info('[MongoDB] Get Data Successfully!');
              },
              err => console.info(`[MongoDB] Error ocurred: ${err}`))
            .finally(() => console.info('[MongoDB] Done'));
          break;
        case 'leds':
          await client
            .query({
              query: gql(`query Query {
                ledValues(num:1){
                  one
                  two
                  timestamp
                }
              }`)
            })
            .then(result => {
                resource.values = result.data.ledValues;
                console.info('[MongoDB] Get Data Successfully!');
              },
              err => console.info(`[MongoDB] Error ocurred: ${err}`))
            .finally(() => console.info('[MongoDB] Done'));
          break;
        case 'ledState':
          await client
            .query({
              query: gql(`query Query {
                ledStateActions(num:1) {
                  _id
                  status
                  timestamp
                  ledId
                  state
                }
              }`)
            })
            .then(result => {
                resource.values = result.data.ledStateActions;
                console.info('[MongoDB] Get Data Successfully!');
              },
              err => console.info(`[MongoDB] Error ocurred: ${err}`))
            .finally(() => console.info('[MongoDB] Done'));
          break;
      }
    }
  });
  resources.push(resource);

  console.info(resources);

  return resources;
}

function getISOTimestamp() {
  return new Date().toISOString();
}

function cappedPush(arr, entry) {
  if (arr.length >= model.customFields.dataArraySize) arr.shift();
  arr.push(entry);

  return arr;
}

async function addThingToModel(thing) {
  let things = model.links.things;

  if (!things.resources) things.resources = {};

  things.resources[thing.id] = {};
  await Object.keys(thing).forEach((key) => {
    if (key != 'id') {
      things.resources[thing.id][key] = thing[key];
    }
  });
}