var resources = require('../../resources/model');

var interval;
var actuator;
var model = resources.pi.actuators.leds['1']; // focus on LED 1
var pluginName = model.name;
var localParams = {
  'simulate': false,
  'frequency': 2000
};

function observe(what) {
  Object.observe(what, (changes) => {
    console.info(`Change detected by plugin for ${pluginName}...`);
    switchOnOff(model.value);
  });
}

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
  observe(model);

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