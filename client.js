const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://192.168.0.14:27017'
const dbName = 'test';
const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}
const client = new MongoClient(url, config);

// client.connect((err) => {
//   console.info('[Info] Connected to MongoDB!');

//   try {
//     const db = client.db(dbName);
//   } catch (err) {
//     console.info(err);
//   }
// });

async function run() {
  await client.connect((err) => {
    console.log("[Info] Connected successfully to server");
    try {
      const collection = client.db(dbName).collection('Person');

      insertData(collection, {
        id: 1,
        firstName: 'Steve',
        lastName: 'Jobs'
      });

    } catch (err) {
      console.info(err);
    } finally {
      client.close();
      console.log('[Info] Server Disconnected');
    }
  });
}

function insertData(collection, data) {
  try {
    collection.insertOne(data);
    console.info('[Info] Inserting Data...');
  } catch (err) {
    console.info(err);
  }
}

run();