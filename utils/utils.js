let model = require('../resources/model');

module.exports = {
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
  },
  cappedPush: (arr, entry) => {
    if (arr.length >= model.customFields.dataArraySize) arr.shift();
    arr.push(entry);
    return arr;
  },
  findObjInArr: (arr, filter) => {
    return arr.find((obj) => obj.id === filter.id);
  },
  createDefaultData: (resources) => {
    Object.keys(resources).forEach(function (resKey) {
      var resource = resources[resKey];
      resource.data = [];
    });
  },
  reverseResults: (arr) => arr.slice(0).reverse(),
  isoTimestamp: () => new Date().toISOString(),
  findProperty: (propId) => model.links.properties.resources[propId]
};