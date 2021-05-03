var onoff = require('onoff');
var resources = require('../../resources/model');

var interval;
var sensor;
var gpio = onoff.Gpio;
var pir = resources.pi.sensors.pir;
var localParams = {
  'simulate': false,
  'frequency': 2000
};

function connectHardware() {
  sensor = new gpio(pir.gpio, 'in', 'both');
  sensor.watch((err, val) => {
    if (err) exit(err);
    pir.value = !!val;
    showValue();
  });
  console.info(`Hardware ${pir.name} sensor stated!`);
}

function simulate() {
  interval = setInterval(() => {
    pir.value = !pir.value;
    showValue();
  }, localParams.frequency);
  console.info(`Simulated ${pir.name} sensor stated!`);
}

function showValue() {
  console.info(pir.value ? 'there is some one!' : 'not anymore!');
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
  console.info(`${pir.name} plugin stopped!`);
};