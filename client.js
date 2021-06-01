const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://192.168.0.14:27017'
const dbName = 'test';
const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}
const client = new MongoClient(url, config);

function insertData() {
  client.connect((err) => {
    console.info('[Info] Connected to MongoDB!');

    try {
      const db = client.db(dbName);
    } catch (err) {
      console.info(err);
    }

    client.close();
  });
}