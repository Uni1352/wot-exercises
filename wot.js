const mongoClient = require('mongodb').MongoClient;
const server = require('./wot-server');
const crud = require('./db/db');

server();

mongoClient.connect('mongodb://192.168.0.14:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, crud.connection);