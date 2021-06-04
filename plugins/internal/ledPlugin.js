const CorePlugin = require('../corePlugin');

class LedPlugin extends CorePlugin {
  constructor(params) {
    super(params, 'leds', ['ledState']);
    super.doActions = this.switchOnOff;

    this.actuators = {};
    this.deviceName = 'LED';
    this.leds = this.model.values;
    this.simulateVal = [true, false];
    this.addValue(this.simulateVal);
    this.setActions();
  }

  connectHardware() {
    const Gpio = require('onoff').Gpio;

    Object.keys(this.leds).forEach((led) => {
      this.actuators[`${led}`] = new Gpio(this.leds[led].customFields.gpio, 'out');
      console.info(`[Hardware] ${this.leds[led].name} actuator started!`);
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
    this.doActions = this.switchOnOff;
  }

  switchOnOff(obj) {
    const target = this.model.data[this.model.data.length - 1];
    const latestVal = [target['1'], target['2']];

    latestVal[parseInt(obj.values.ledId) - 1] = obj.values.state;

    if (!this.params.simulate) {
      this.actuators[`${obj.values.ledId}`].write(obj.values.state === true ? 1 : 0, () => {
        this.addValue(latestVal);
      });
    } else this.addValue(latestVal);

    obj.status = 'completed';
    console.info(`[Info] Change value of LED ${obj.values.ledId} to ${obj.values.state}`);
  }
}

module.exports = LedPlugin;