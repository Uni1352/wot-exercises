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
    if (err) console.log(`[Error] Connect Error: ${err}`);

    const db = client.db(dbName);
    console.log("[Info] Connect successfully to server");
  });
}

run();