const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://192.168.0.14:27017';
const dbName = 'test';
const client = new MongoClient(url, {
  useUnifiedTopology: true
});

client.connect((err) => {
  if (err) throw err;

  console.info('[Info] Connected to MongoDB!');
  client.close();
});