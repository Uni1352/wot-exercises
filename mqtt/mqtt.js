const mqtt = require('mqtt');

let client;
let url = 'mqtt://192.168.43.129:1883';
let options = {
  clientId: 'pi',
  username: 'uni',
  password: 'uni135219'
};

module.exports = {
  connectMQTTBroker,
  disconnectMQTTBroker,
  subscribeTopic,
  publishTopic
};

function connectMQTTBroker() {
  client = mqtt.connect(url, options);

  client.on('error', (error) => {
    console.info(`[MQTT] MQTT Broker Connection Failed.`);
    console.info(`[MQTT] Error: ${error}`);
  });

  client.on('message', (topic, message) => {
    console.info(`[MQTT] Receive Topic ${topic} Message:`);
    console.info(JSON.parse(message.toString()));
  });
}

function disconnectMQTTBroker() {
  console.info(`[MQTT] Close Connection To MQTT Broker!`);
  clearInterval(interval);
  client.end();
}

function subscribeTopic(topic) {
  console.info(`[MQTT] Subscribe Topic: ${topic}`);
  client.subscribe(topic);
}

function publishTopic(topic, msg) {
  console.info(`[MQTT] Publish ${topic} Message`);
  client.publish(topic, msg);
}