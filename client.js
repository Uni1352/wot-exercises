const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://192.168.0.14:27017'
const dbName = 'test';
const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}
const client = new MongoClient(url, config);

async function run() {
  await client.connect((err) => {
    console.log("[Info] Connected successfully to server");
    try {
      const collection = client.db(dbName).collection('Person');

      collection.insertOne({
        id: 1,
        firstName: 'Steve',
        lastName: 'Jobs'
      });
      console.info('[Info] Inserting Data...');
    }
  });
}

run().catch((err) => console.info(err));