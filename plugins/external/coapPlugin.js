const utils = require('../../utils/utils');

let model = require('../../resources/model');

let interval, readSensorInterval;
let deviceSensor, pluginName;
let localParams = {
  'simulate': false,
  'frequency': 2000
};

function connectHardware() {
  const coap = require('coap');
  const bl = require('bl');

  let sensor = {
    read: () => {
      coap
        .request({
          host: 'localhost',
          port: 5683,
          pathname: '/co2',
          options: {
            'Accept': 'application/json'
          }
        })
        .on('response', (res) => {
          console.info(`CoAP response code: ${res.code}`);

          if (res.code !== '2.05')
            console.info(`Error while contacting CoAP service: ${res.code}`);

          res.pipe(bl((err, data) => {
            let json = JSON.parse(data);

            deviceSensor.value = json.co2;
            showValue();
          }))
        })
        .end();
    }
  }

  readSensorInterval = setInterval(() => sensor.read(), localParams.frequency);
}

function simulate() {
  interval = setInterval(() => {
    deviceSensor.value = utils.getRandomNum(0, 1000);
    showValue();
  }, localParams.frequency);

  console.info(`Simulated ${pluginName} sensor started!`);
}

function showValue() {
  console.info(`CO2 Level: ${deviceSensor.value} ppm`);
}

function configure() {
  utils.addDevice('coapDevice', 'A CoAP Device',
    'A CoAP Device', {
      'co2': {
        'name': 'CO2 Sensor',
        'description': 'An ambient CO2 sensor',
        'unit': 'ppm',
        'value': 0
      }
    });

  deviceSensor = model.things.coapDevice.sensors.co2;
  pluginName = device.name;
}


module.exports = {
  startPlugin: (params) => {
    localParams = params;
    configure();

    if (localParams.simulate) simulate();
    else connectHardware();
  },
  stopPlugin: () => {
    if (localParams.simulate) clearInterval(interval);
    else clearInterval(readSensorInterval);

    console.info(`${pluginName} plugin stopped!`);
  }
}