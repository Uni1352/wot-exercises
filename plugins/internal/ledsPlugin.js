const events = require('events');
const emitter = new events.EventEmitter();
const model = resources.pi.actuators.leds['1']; // focus on LED 1
const pluginName = model.name;

let resources = require('../../resources/model');
let interval;
let actuator;
let localParams = {
  'simulate': false,
  'frequency': 2000
};

// function observe(what) {
//   Object.observe(what, (changes) => {
//     console.info(`Change detected by plugin for ${pluginName}...`);
//     switchOnOff(model.value);
//   });
// }

function switchOnOff(val) {
  if (!localParams.simulate) {
    actuator.write(val === true ? 1 : 0,
      () => console.info(`Changed value of ${pluginName} to ${val}`));
  }
}

function connectHardware() {
  const gpio = require('onoff').Gpio;

  actuator = new gpio(model.gpio, 'out');
  console.info(`Hardware ${pluginName} actuator started!`);
}

function simulate() {
  interval = setInterval(() => {
    model.value = !model.value;
  }, localParams.frequency);
  console.info(`Simulated ${pluginName} actuator started!`);
}

exports.start = (params) => {
  localParams = params;
  // observe(model);

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
    sensor.unexport();
  }
  console.info(`${pluginName} plugin stopped.`);
};