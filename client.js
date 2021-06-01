const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://192.168.0.14:27017'
const dbName = 'test';
const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 5000,
  socketTimeoutMS: 5000
}
const client = new MongoClient(url, config);

client.connect((err) => {
  try {
    const db = client.db(dbName);

    console.info('[Info] Connected to MongoDB!');
    client.close();
  } catch (err) {
    console.info(err);
  }
});