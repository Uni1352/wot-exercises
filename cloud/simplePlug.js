var mqtt = require('mqtt');

var config = require('./config.json');

var thngID = config.thngId;
var thngApiKey = config.thngApiKey;
var thngUrl = `/thngs/${thngID}`;
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

console.log(`Using Thng #${thngID} with API key: ${thngApiKey}`);

client = mqtt.connect('mqtts://mqtt.evrythng.com:8883', {
  username: 'authorization',
  password: thngApiKey
});

client.on('connect', () => {
  client.subscribe(`${thngUrl}/properties/`);
  updateProperty('livenow', true);
  interval = setInterval(updateProperties, 5000);
});

client.on('message', (topic, message) => console.log(message.toString()));

process.on('SIGINT', () => {
  clearInterval(interval);
  updateProperty('livenow', false);
  client.end();
  process.exit();
});