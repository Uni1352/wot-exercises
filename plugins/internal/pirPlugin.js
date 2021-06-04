const CorePlugin = require('../corePlugin');

class PirPlugin extends CorePlugin {
  constructor(params) {
    super(params, 'pir');

    this.sensor;
    this.deviceName = 'PIR';
    this.simulateVal = true;
    this.addValue(false);
    this.setActions();
  }

  connectHardware() {
    const Gpio = require('onoff').Gpio;

    this.sensor = new Gpio(this.model.values.presence.customFields.gpio, 'in', 'both');
    this.sensor.watch((err, val) => {
      if (err) exit(err);

      this.addValue(!!val);
      this.showValue();
    });
    console.info(`[Hardware] ${this.model.name} sensor started!`);
  }

  createValue(val) {
    return {
      "presence": val,
      "timestamp": new Date().toISOString()
    };
  }

  setActions() {
    this.doSimulate = () => {
      this.simulateVal = !this.simulateVal;
      this.addValue(this.simulateVal);
    };
    this.doStop = () => this.sensor.unexport();
  }
}

module.exports = PirPlugin;