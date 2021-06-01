const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://192.168.0.14:27017'
const dbName = 'test';
const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}
const client = new MongoClient(url, config);

async function run() {
  try {
    await client.connect();
    const db = client.db(dbName);
    console.log("[Info] Connect successfully to server");
  } catch (err) {
    console.log(`[Error] Connect Error: ${err}`);
  }
}

function insertDocument(docs) {
  const collection = client.db(dbName).collection('Person');

  collection.insertMany(docs);
  console.info(`[Insert] Inserting Docs...`);
}

try {
  client.connect();
  console.log("[Info] Connect successfully to server");

  // insertDocument([{
  //   id: 1,
  //   firstName: 'Steve',
  //   lastName: 'Jobs'
  // }, {
  //   id: 2,
  //   firstName: 'Bill',
  //   lastName: 'Gates'
  // }]);
} catch (err) {
  console.log(`[Error] Error: ${err}`);
} finally {
  client.close();
}