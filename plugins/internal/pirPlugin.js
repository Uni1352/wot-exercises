const CorePlugin = require('../corePlugin');

class PirPlugin extends CorePlugin {
  constructor(params) {
    super(params, 'pir');

    this.sensor;
    this.addValue(true);
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
    // this.interval = setInterval(() => {
    //   this.addValue(false);
    //   this.showValue();
    // }, this.params.frequency);
    // console.info(`[simulator started] ${this.model.name}`);
    super.simulate(() => this.addValue(false));
  }

  createValue(val) {
    return {
      "presence": val,
      "timestamp": new Date().toISOString()
    };
  }

  stopPlugin() {
    if (this.params.simulate) clearInterval(this.interval);
    else this.sensor.unexport();

    console.info(`[plugin stopped] ${this.model.name}`);
  }
}

module.exports = PirPlugin;