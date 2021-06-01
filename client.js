const MongoClient = require('mongodb').MongoClient;
const curd = require('./db/db');

const url = 'mongodb://192.168.43.57:27017';
const dbName = 'test';
const client = new MongoClient(url, {
  useUnifiedTopology: true
});

client.connect((err) => {
  if (err) throw err;

  console.info('[Info] Connected to MongoDB!');
  client.close();
});