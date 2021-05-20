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
    console.info(`[simulator started] ${this.model.name}`);
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

  observeActions() {
    this.actions.forEach((actionId) => {
      let actionData = model.links.actions.resources[actionId].data;

      actionData = new Proxy(actionData, {
        get: (target) => target,
        set: (arr, prop, val) => {
          console.info(`[proxy] plugin action detected: ${actionId}`);
          console.info(arr, prop, val);
          console.info(actionData);
          // this.doActions(val);
        }
      });
      console.info(`[proxy] ${actionId} proxy created!`);

      setTimeout(() => {
        console.log(typeof actionData);
      }, 5000);
    });
  }

  startPlugin() {
    if (this.actions) this.observeActions();

    if (this.params.simulate) this.simulate();
    else this.connectHardware();

    console.info(`[plugin started] ${this.model.name}`);
  }

  stopPlugin() {
    if (this.params.simulate) clearInterval(this.interval);
    else if (this.doStop) this.doStop();

    console.info(`[plugin stopped] ${this.model.name}`);
  }
}

module.exports = CorePlugin;