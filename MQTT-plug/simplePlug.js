const mqtt = require('mqtt');
const config = require('./config.json');

const thng = {
  id: config.thngId,
  url: `/thngs/${config.thngId}`,
  apiKey: config.thngApiKey
}

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

console.log(`Using Thng ${thng.id}`);

// create MQTT connection
client = mqtt.connect('mqtts://mqtt.evrythng.com:8883', {
  username: 'authorization',
  password: thng.apiKey
});

// MQTT connection succeed
client.on('connect', () => {
  client.subscribe(`${thng.url}/properties/`);
  updateProperty('livenow', true);

  if (!interval) interval = setInterval(updateProperties, 2000);
});

client.on('message', (topic, message) => {
  console.log(topic.split('/'));
  console.log(message.toString());
});

process.on('SIGINT', function () {
  clearInterval(interval);
  updateProperty('livenow', false);
  client.end();
  process.exit();
});