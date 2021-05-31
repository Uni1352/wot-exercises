const mongoClient = require('mongodb').MongoClient;
const curd = require('./curd');

const url = 'mongodb://192.168.0.14:27017/test';

// mongoClient.connect(url, curd.connection);
mongoClient.connect(url, {
  useUnifiedTopology: true
}, curd.connection);