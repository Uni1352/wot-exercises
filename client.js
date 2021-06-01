const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const dbName = 'test';
const client = new MongoClient(url, {
  useUnifiedTopology: true
});

client.connect((err) => {
  if (err) throw err;

  console.info('[Info] Connected to MongoDB!');
  client.close();
});