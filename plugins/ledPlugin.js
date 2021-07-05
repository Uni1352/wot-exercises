const mqtt = require('../mqtt/mqtt');

let model = require('../resources/model');
let leds = model.links.properties.resources.leds;

module.exports = {
  pluginStart
};

function pluginStart() {
  model.links.actions.resources.ledState.data = new Proxy(model.links.actions.resources.ledState.data, {
    set: (arr, prop, val) => {
      if (!isNaN(parseInt(index))) {
        console.info(`[Proxy] plugin action detected: ledState`);
        arr[index] = val;
        switchOnOff(val);
      }
      return true;
    }
  })
  console.info(`[Proxy] ledState proxy created!`);
}

function createValue(val) {
  return {
    "1": val[0],
    "2": val[1],
    "timestamp": new Date().toISOString()
  };
}

function addValue(val) {
  utils.cappedPush(leds.data, createValue(val));
}

function switchOnOff(obj) {
  const target = this.model.data[this.model.data.length - 1];
  const latestVal = [target['1'], target['2']];

  mqtt.publishTopic('/actions/ledState', JSON.stringify(obj.values));

  latestVal[parseInt(obj.values.ledId) - 1] = obj.values.state;
  addValue(latestVal);

  obj.status = 'completed';
  console.info(`[Info] Change value of LED ${obj.values.ledId} to ${obj.values.state}`);
}