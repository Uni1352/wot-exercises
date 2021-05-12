const model = require('../../resources/model');
const utils = require('../../utils/utils');

const temperature = model.pi.sensors.temperature;
const humidity = model.pi.sensors.humidity;

let interval, sensor;
let localParams = {
  'simulate': false,
  'frequency': 2000
};

function connectHardware() {
  const driver = require('node-dht-sensor');

  sensor = {
    initialize: () => driver.initialize(22, temperature.gpio),
    read: () => {
      let readout = driver.read();

      temperature.value = parseFloat(readout.temperature.toFixed(2));
      humidity.value = parseFloat(readout.humidity.toFixed(2));
      showValue();

      setTimeout(() => sensor.read(), localParams.frequency);
    }
  }

  if (sensor.initialize()) {
    console.info(`Hardware DHT22 sensor started!`);
    sensor.read();
  } else {
    console.warn('Failed to initialize sensor!');
  }
}

function simulate() {
  interval = setInterval(() => {
    temperature.value = utils.getRandomNum(0, 40);
    humidity.value = utils.getRandomNum(0, 100);
    showValue();
  }, localParams.frequency);
  console.info(`Simulated DHT22 sensor started!`);
}

function showValue() {
  console.info(`Temperature: ${temperature.value} C, Humidity: ${humidity.value} %`);
}

module.exports = {
  startPlugin: (params) => {
    localParams = params;

    if (localParams.simulate) simulate();
    else connectHardware();
  },
  stopPlugin: () => {
    if (localParams.simulate) clearInterval(interval);
    else sensor.unexport();

    console.info(`DHT22 plugin stopped!`);
  }
};