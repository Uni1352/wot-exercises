let model = require('../resources/model');

module.exports = {
  getRandomNum: (min, max) => Math.floor(Math.random() * (max - min) + min),
  addDevice: (id, name, description, sensors, actuators) => {
    if (!model.things) {
      model.things = {};
    }

    model.things[id] = {
      'name': name,
      'description': description,
      'sensors': sensors,
      'actuators': actuators
    }
  }
}