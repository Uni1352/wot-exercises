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
      const db = client.db(dbName);
    } catch (err) {
      console.info(err);
    } finally {
      await client.close();
      console.log('[Info] Server Disconnected');
    }
  });
}

function insertData(data) {
  client.connect();
  console.info('[Info] Connected to MongoDB!');

  try {
    const collection = client.db(dbName).collection('Person');

    collection.insertOne(data);
    console.info('[Info] Inserting Data...');
  } catch (err) {
    console.info(err);
  }
}

// insertData({
//   id: 1,
//   firstName: 'Steve',
//   lastName: 'Jobs'
// });

run();