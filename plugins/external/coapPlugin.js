var coap = require('coap');
var bl = require('bl');

var resources = require('../../resources/model');
var utils = require('../../utils/utils');

var interval;
var pollInterval;
var sensor;
var coapDevice;
var pluginName;
var localParams = {
  'simulate': false,
  'frequency': 2000
};

function connectHardware() {
  sensor = {
    read: () => {
      coap.request({
        host: '127.0.0.1',
        port: 5683,
        pathname: '/co2',
        options: {
          'Accept': 'application/json'
        }
      }).on('response', (res) => {
        console.info(`CoAP respond code: ${res.code}`);

        if (res.code !== '2.05')
          console.log(`Error while contacting CoAP service ${res.code}`);

        res.pipe(bl((err, data) => {
          var json = JSON.parse(data);

          coapDevice.value = json.co2;
          showValue();
        }))

      }).end();
    }
  }

  pollInterval = setInterval(() => sensor.read(), localParams.frequency);
}

function simulate() {
  interval = setInterval(() => {
    coapDevice.value = Math.floor(Math.random() * 1000);
    showValue();
  }, localParams.frequency);
  console.info(`Simulated ${pluginName} sensor started!`);
}

function showValue() {
  console.info(`CO2 Level: ${coapDevice.value} ppm`);
}

function configure() {
  utils.addDevice('coapDevice', 'A CoAP Device', 'A CoAP Device', {
    'co2': {
      'name': 'CO2 Sensor',
      'description': 'An ambient CO2 sensor',
      'unit': 'ppm',
      'value': 0
    }
  });

  coapDevice = resources.things.coapDevice.sensors.co2;
  pluginName = coapDevice.name;
}

exports.start = (params, app) => {
  localParams = params;
  configure(app);

  if (params.simulate) {
    simulate();
  } else {
    connectHardware();
  }
};

exports.stop = () => {
  if (params.simulate) {
    clearInterval(interval);
  } else {
    clearInterval(pollInterval);
  }
  console.info(`${pluginName} plugin stopped!`);
};