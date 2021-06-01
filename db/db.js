const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://192.168.0.14:27017'
const dbName = 'wot';
const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}
const client = new MongoClient(url, config);

async function insert(target, docs, opt) {
  try {
    await client.connect();
    console.info(`[MongoDB] Connect to DB server successfully!`);

    const collection = client.db(dbName).collection(target);
    const result = await collection.insertMany(docs, opt);

    console.info(`[MongoDB] ${result.insertedCount} documents were inserted!`);
  } catch (err) {
    console.info(`[Error] Connect to DB server failed.`);
  } finally {
    await client.close();
    console.log(`[MongoDB] Disconnect!`);
  }
}

module.exports = {
  insertDoc: insert
}