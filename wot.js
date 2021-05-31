const mongoClient = require('mongodb').MongoClient;
const server = require('./wot-server');
const curd = require('./db/db');

server();

mongoClient.connect('mongodb://127.0.0.1:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, curd.connection);