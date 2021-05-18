const util = require('util');

const findProperty = require('../utils/utils').findProperty;
const cappedPush = require('../utils/utils').cappedPush;

let model = require('../resources/model');

class CorePlugin {
  constructor(params, propId, actionsIds) {
    if (params) this.params = params;
    else this.params = {
      'simulate': false,
      'frequency': 5000
    };

    this.interval;
    this.actions = actionsIds;
    this.model = findProperty(propId);
  }

  simulate(doSimulate) {
    this.interval = setInterval(() => {
      doSimulate();
      this.showValue();
    }, this.params.frequency);
    console.info(`[simulator started] ${this.model.name}`);
  }

  connectHardware() {
    throw new Error('connectedHardware() should be implemented by Plugin');
  }

  createValue(val) {
    throw new Error('createValue(val) should be implemented by Plugin');
  }

  addValue(val) {
    cappedPush(this.model.data, this.createValue(val));
  }

  showValue() {
    console.info(`${this.model.name}: ${util.inspect(this.model.data[this.model.data.length-1])}`);
  }

  observeActions() {
    const proxy = [];
    const handler = {
      set: (obj, prop, val) => {
        console.info(`[plugin action detected] ${this.actionId}`);
        console.info(obj, val);
        // doActions(obj, val);
      }
    };

    this.actions.forEach((actionId) => {
      proxy.push(new Proxy(model.links.actions.resources[actionId].data, handler));
      console.info(`${actionId} proxy created!`);
    });
  }

  startPlugin() {
    if (this.actions) this.observeActions();

    if (this.params.simulate) this.simulate();
    else this.connectHardware();

    console.info(`[plugin started] ${this.model.name}`);
  }

  stopPlugin(doStop) {
    if (this.params.simulate) clearInterval(this.interval);
    else if (doStop) doStop();

    console.info(`[plugin stopped] ${this.model.name}`);
  }
}

module.exports = CorePlugin;