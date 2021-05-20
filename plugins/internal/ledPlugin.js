const CorePlugin = require('../corePlugin');

let model = require('../../resources/model');

class LedPlugin extends CorePlugin {
  constructor(params) {
    super(params, 'leds', ['ledState']);
    super.doActions = this.switchOnOff;

    this.actuators = {};
    this.leds = this.model.values;
    this.simulateVal = [false, true];
    // this.doActions = this.switchOnOff();
    this.setActions();
  }

  connectHardware() {
    const Gpio = require('onoff').Gpio;

    Object.keys(this.leds).forEach((led) => {
      this.actuators[`${led}`] = new Gpio(this.leds[led].customFields.gpio, 'out');
      console.info(`Hardware ${this.leds[led].name} actuator started!`);
    });
  }

  createValue(val) {
    return {
      "1": val[0],
      "2": val[1],
      "timestamp": new Date().toISOString()
    };
  }

  setActions() {
    this.doSimulate = () => {
      for (let val of this.simulateVal) val = !val;
      this.addValue(this.simulateVal);
    };
    this.doStop = () => {
      Object.keys(this.leds).forEach((led) => this.actuators[`${led}`].unexport());
    };
  }

  switchOnOff(obj) {
    let val = this.model.data[0];

    this.actuators[`${obj.values.ledId}`].write(obj.values.state === true ? 1 : 0, () => {
      val[`${obj.ledId}`] = obj.values.state;
      this.addValue(val);
    });

    obj.status = 'completed';
    console.info(`Change value of LED ${obj.values.ledId} to ${obj.values.state}`);
  }
}

module.exports = LedPlugin;