var sensorLib = require('node-dht-sensor');
var resources = require('../../resources/model');

var interval;
var sensor;
var temperature = resources.pi.sensors.temperature;
var humidity = resources.pi.sensors.humidity;
var localParams = {
  'simulate': false,
  'frequency': 2000
}

function connectHardware() {
  sensor = {
    initialize: () => (sensorLib.initialize(22, temperature.gpio)),
    read: () => {
      let readout = sensorLib.read();

      temperature.value = parseFloat(readout.temperature.toFixed(2));
      humidity.value = parseFloat(readout.humidity.toFixed(2));

      showValue();
      setTimeout(() => (sensor.read()), localParams.frequency);
    }
  }

  if (sensor.initialize()) {
    console.info('Hardware DHT22 sensor started!');
    sensor.read();
  } else {
    console.info('Failed to initialize sensor!');
  }
}

function simulate() {
  interval = setInterval(() => {
    temperature.value = Math.floor(Math.random() * 40);
    humidity.value = Math.floor(Math.random() * 100);
    showValue();
  }, localParams.frequency);
  console.info('Simulated DHT22 sensor started!');
}

function showValue() {
  console.info(`Temperature: ${temperature.value} C, Humidity: ${humidity.value} %`);
}

exports.start = (params) => {
  localParams = params;

  if (localParams.simulate) {
    simulate();
  } else {
    connectHardware();
  }
};

exports.stop = () => {
  if (localParams.simulate) {
    clearInterval(interval);
  } else {
    if (err) console.log(`An error ocurred: ${err}`);
    sensor.unexport();
  }
  console.info(`DHT22 plugin stopped!`);
};