const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://192.168.0.14:27017'
const dbName = 'test';
const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}
const client = new MongoClient(url, config);

client.connect((err) => {
  console.info('[Info] Connected to MongoDB!');

  try {
    const db = client.db(dbName);

    console.info('[Info] Inserting Data...');
    db.collection('Person', (err, collection) => {
      collection.insertOne({
        id: 1,
        firstName: 'Steve',
        lastName: 'Jobs'
      });
    });

  } catch (err) {
    console.info(err);
  } finally {
    client.close();
  }
});