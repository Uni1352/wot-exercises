const CorePlugin = require('../corePlugin');

class PirPlugin extends CorePlugin {
  constructor(params) {
    super(params, 'pir');

    this.sensor;
    this.simulateVal = true;
    this.addValue(this.simulateVal);
  }

  connectHardware() {
    const Gpio = require('onoff').Gpio;

    this.sensor = new Gpio(this.model.values.presence.customFields.gpio, 'in', 'both');
    this.sensor.watch((err, val) => {
      if (err) exit(err);

      this.addValue(!!val);
      this.showValue();
    });
  }

  simulate() {
    super.simulate(() => {
      this.simulateVal = !this.simulateVal;
      this.addValue(this.simulateVal);
    });
  }

  createValue(val) {
    return {
      "presence": val,
      "timestamp": new Date().toISOString()
    };
  }

  stopPlugin() {
    super.stopPlugin(() => this.sensor.unexport());
  }
}

module.exports = PirPlugin;