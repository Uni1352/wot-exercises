var mqtt = require('mqtt');

var config = require('./config.json');

var thngID = config.thngId;
var thngApiKey = config.thngApiKey;
var thngUrl = `/thngs/${thngID}`;
var status = false;
var interval;
var client;

function updateProperty(prop, val) {
  client.publish(`${thngUrl}/properties/${prop}`, `[{"value":${val}}]`);
}

function updateProperties() {
  var voltage = (219.5 + Math.random()).toFixed(3);
  var current = (Math.random() * 10).toFixed(3);
  var power = (voltage * current * (0.6 + Math.random() / 10)).toFixed(3);

  updateProperty('voltage', voltage);
  updateProperty('current', current);
  updateProperty('power', power);
}

function handleAction(action) {
  switch (action.type) {
    case '_setStatus':
      console.log(`ACTION: _setStatus changed to: ${action.customFields.status}`);
      status = Boolean(action.customFields.status);
      updateProperty('status', status);
      break;
    case '_setLevel':
      console.log(`ACTION: _setLevel changed to: ${action.customFields.level}`);
      break;
    default:
      console.log(`ACTION: Unknown action type: ${action.type}`);
  }
}

console.log(`Using Thng #${thngID} with API key: ${thngApiKey}`);

client = mqtt.connect('mqtts://mqtt.evrythng.com:8883', {
  username: 'authorization',
  password: thngApiKey
});

client.on('connect', () => {
  client.subscribe(`${thngUrl}/properties/`);
  client.subscribe(`${thngUrl}/actions/all`);
  updateProperty('livenow', true);
  interval = setInterval(updateProperties, 5000);
});

client.on('message', (topic, message) => {
  var resources = topic.split('/');

  if (resources[1] && resources[1] === 'thngs') {
    if (resources[2] && resources[2] === thngID) {
      if (resources[3] && resources[3] === 'properties') {
        var property = JSON.parse(message);

        console.log(`Property was updated: ${property[0].key}=${property[0].value}`);
      } else if (resources[3] && resources[3] === 'actions') {
        var action = JSON.parse(message);

        handleAction(action);
      }
    }
  }
});

process.on('SIGINT', () => {
  clearInterval(interval);
  updateProperty('livenow', false);
  client.end();
  process.exit();
});