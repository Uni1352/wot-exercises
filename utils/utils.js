let model = require('../resources/model');

module.exports = {
  getRandomNum: (min, max) => Math.floor(Math.random() * (max - min) + min),
  addDevice: (id, name, description, sensors, actuators) => {
    if (!model.things) model.things = {};

    model.things[id] = {
      'name': name,
      'description': description,
      'sensors': sensors,
      'actuators': actuators
    }
  },
  extractFields: (fields, object, target) => {
    if (!target) target = {};
    for (let field of fields) target[field] = object[field];

    return target;
  },
  modelToResource: (subModel, withValue) => {
    let resources = [];

    Object.keys(subModel).forEach((key) => {
      let val = subModel[key];
      let resource = {};

      resource.id = key;
      resource.name = val['name'];

      if (withValue) resource.values = val.data[val.data.length - 1];

      resources.push(resource);
    });

    return resources;
  }
}