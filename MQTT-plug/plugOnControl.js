const mqtt = require('mqtt');
const config = require('./config.json');

const thng = {
  id: config.thngId,
  url: `/thngs/${config.thngId}`,
  apiKey: config.thngApiKey
}

let status = false;
let interval;
let client;

function updateProperty(prop, val) {
  client.publish(`${thng.url}/properties/${prop}`, `[{"value":${val}}]`);
}

function updateProperties() {
  let voltage = (219.5 + Math.random()).toFixed(3);
  let current = (Math.random() * 10).toFixed(3);
  let power = (voltage * current * (0.6 + Math.random() / 10)).toFixed(3);

  updateProperty('voltage', voltage);
  updateProperty('current', current);
  updateProperty('power', power);
}

function handleActions(action) {
  switch (action.type) {
    case '_setStatus':
      status = Boolean(action.customFields.status);
      console.log(`ACTION: _setStatus changed to ${status}`);
      updateProperty('status', status);
      break;
    case '_setLevel':
      console.log(`ACTION: _setLevel changed to: ${action.customFields.level}`);
      break;
    default:
      console.log(`ACTION: Unknown action type: ${action.type}`);
  }
}

// create MQTT connection
client = mqtt.connect('mqtts://mqtt.evrythng.com:8883', {
  username: 'authorization',
  password: thng.apiKey
});

// MQTT connection succeed
client.on('connect', () => {
  client.subscribe(`${thng.url}/properties/`);
  client.subscribe(`${thng.url}/actions/all`);
  updateProperty('livenow', true);

  if (!interval) interval = setInterval(updateProperties, 2000);
});

client.on('message', (topic, message) => {
  const resource = topic.split('/');

  if (resource[1] && resource[1] == 'thngs') {
    if (resource[2] && resource[2] == thng.id) {
      if (resource[3]) {
        switch (resource[3]) {
          case 'properties':
            const prop = JSON.parse(message);

            console.log(`Property was Updated: ${prop[0].key}=${prop[0].value}`);
            break;
          case 'actions':
            const action = JSON.parse(message);

            handleActions(action);
        }
      }
    }
  }
});

process.on('SIGINT', function () {
  clearInterval(interval);
  updateProperty('livenow', false);
  client.end();
  process.exit();
});