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

    db.collection('Person', (err, collection) => {
      collection.insert({
        id: 1,
        firstName: 'Steve',
        lastName: 'Jobs'
      });
      collection.insert({
        id: 2,
        firstName: 'Bill',
        lastName: 'Gates'
      });
      collection.insert({
        id: 3,
        firstName: 'James',
        lastName: 'Bond'
      });
    });

  } catch (err) {
    console.info(err);
  }

  client.close();
});