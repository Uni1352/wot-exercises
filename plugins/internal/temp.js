let model = require('../../resources/model');

let interval;
let actuators = {};
let leds = model.pi.actuators.leds;
let localParams = {
  'simulate': false,
  'frequency': 2000
};

function connectHardware() {
  const Gpio = require('onoff').Gpio;

  Object.keys(leds).forEach((key) => {
    actuators[`${leds[key].name}`] = new Gpio(leds[key].gpio, 'out');
  });
}

function simulate() {
  interval = setInterval(() => {
    Object.keys(leds).forEach((key) => {
      leds[key].value = !leds[key].value;
      console.info(`Change value of ${leds[key].name} to ${leds[key].value}`);
    });
  }, localParams.frequency);

  for (let key in leds) {
    console.info(`Simulated ${leds[key].name} actuator started!`);
  }
}

function createProxy(target) {
  const handler = {
    set: (obj, prop, val) => {
      if (!localParams.simulate && prop === 'value') switchOnOff(obj, val);
    }
  }
  const proxy = [];

  Object.keys(target).forEach((key) => {
    proxy.push(new Proxy(target[key], handler));
    console.info(`${target[key].name} proxy created!`);
  });
}

function switchOnOff(obj, val) {
  actuators[obj.name].write(val === true ? 1 : 0,
    () => console.info(`Change value of ${obj.name} to ${val}`));
}

module.exports = {
  startPlugin: (params) => {
    localParams = params;
    createProxy(leds);

    if (localParams.simulate) simulate();
    else connectHardware();
  },
  stopPlugin: () => {
    if (localParams.simulate) clearInterval();
    else Object.keys(leds).forEach((key) => {
      actuators[`${leds[key].name}`].unexport();
    });
  }
}