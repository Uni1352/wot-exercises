const CorePlugin = require('../corePlugin');

class PirPlugin extends CorePlugin {
  constructor(params) {
    super(params, 'pir');

    this.sensor;
    this.addValue(true);
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
    console.info(`Hardware ${this.model.name} sensor started!`);
  }

  createValue(val) {
    return {
      "presence": val,
      "timestamp": new Date().toISOString()
    };
  }

  setActions() {
    this.doSimulate = () => this.addValue(false);
    this.doStop = () => this.sensor.unexport();
    console.info('test');
  }
}

module.exports = PirPlugin;