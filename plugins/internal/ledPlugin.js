const CorePlugin = require('../corePlugin');

let model = require('../../resources/model');

class LedPlugin extends CorePlugin {
  constructor(params) {
    super(params, 'leds', ['ledState']);

    this.actuators = {};
    this.leds = this.model.values;
    this.simulateVal = [true, true];
    this.addValue(this.simulateVal);
  }

  switchOnOff() {}

  connectHardware() {
    const Gpio = require('onoff').Gpio;

    Object.keys(this.leds).forEach((led) => {
      this.actuators[`${led}`] = new Gpio(this.leds[led].customFields.gpio, 'out');
    });
  }

  simulate() {
    super.simulate(() => {
      for (let i = 0; i < this.simulateVal.length; i++) {
        this.simulateVal[i] = !this.simulateVal[i];
      }

      this.addValue(this.simulateVal);
    });
  }

  createValue(val) {
    return {
      "1": val[0],
      "2": val[1],
      "timestamp": new Date().toISOString()
    };
  }

  stopPlugin() {
    super.stopPlugin(() => {
      Object.keys(this.leds).forEach((led) => this.actuators[`${led}`].unexport());
    });
  }
}

module.exports = LedPlugin;