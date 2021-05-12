const model = require('../../resources/model');

const pir = model.pi.sensors.pir;
const pluginName = pir.name;

let interval, sensor;
let localParams = {
  'simulate': false,
  'frequency': 2000
};

function connectHardware() {
  const Gpio = require('onoff').Gpio;

  sensor = new Gpio(pir.gpio, 'in', 'both');
  sensor.watch((err, value) => {
    if (err) exit(err);

    pir.value = !!value;
    showValue();
  });
  console.info(`Hardware ${pluginName} sensor started!`);
}

function simulate() {
  interval = setInterval(() => {
    pir.value = !pir.value;
    showValue();
  }, localParams.frequency);
  console.info(`Simulated ${pluginName} sensor started!`);
}

function showValue() {
  console.info(pir.value ? 'Someone there!' : 'Nobody!');
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

    console.info(`${pluginName} plugin stopped!`);
  }
};