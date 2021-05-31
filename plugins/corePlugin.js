const util = require('util');
const utils = require('../utils/utils');

let model = require('../resources/model');

class CorePlugin {
  constructor(params, propId, actionsIds) {
    if (params) this.params = params;
    else this.params = {
      'simulate': false,
      'frequency': 5000
    };

    this.interval;
    this.simulateVal;
    this.doSimulate;
    this.doStop;
    this.doActions;
    this.actions = actionsIds;
    this.model = utils.findProperty(propId);
  }

  simulate() {
    this.interval = setInterval(() => {
      this.doSimulate();
      this.showValue();
    }, this.params.frequency);
    console.info(`[Simulator] ${this.model.name} started.`);
  }

  connectHardware() {
    throw new Error('connectedHardware() should be implemented by Plugin');
  }

  createValue(val) {
    throw new Error('createValue(val) should be implemented by Plugin');
  }

  addValue(val) {
    utils.cappedPush(this.model.data, this.createValue(val));
  }

  showValue() {
    console.info(`${this.model.name}: ${util.inspect(this.model.data[this.model.data.length-1])}`);
  }

  createProxy(target) {
    this.actions.forEach((actionId) => {
      target[actionId].data = new Proxy(target[actionId].data, {
        set: (arr, index, val) => {
          if (!isNaN(parseInt(index))) {
            console.info(`[Proxy] plugin action detected: ${actionId}`);
            arr[index] = val;
            if (this.doActions) this.doActions(val);
          }
          return true;
        }
      });
      console.info(`[Proxy] ${actionId} proxy created!`);
    });
  }

  startPlugin() {
    if (this.actions) this.createProxy(model.links.actions.resources);

    mongoClient.connect(url, {
      useUnifiedTopology: true
    }, curd.connection);

    if (this.params.simulate) this.simulate();
    else this.connectHardware();

    console.info(`[Plugin] ${this.model.name} started.`);
  }

  stopPlugin() {
    if (this.params.simulate) clearInterval(this.interval);
    else if (this.doStop) this.doStop();

    console.info(`[Plugin] ${this.model.name} stopped.`);
  }
}

module.exports = CorePlugin;