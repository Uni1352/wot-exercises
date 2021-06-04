const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://192.168.0.14:27017'
const dbName = 'wot';
const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}
const client = new MongoClient(url, config);

module.exports = {
  startDB: async () => {
    try {
      await client.connect();
      console.info(`[MongoDB] DB server started.`);
    } catch (err) {
      console.info(`[Error] ${err}`);
    }
  },
  closeDB: () => {
    client.close();
    console.info(`[MongoDB] DB server closed.`);
  },
  insertDoc: async (target, doc, opt) => {
    try {
      const collection = client.db(dbName).collection(target);

      await collection.insertOne(doc, opt);
      console.info(`[MongoDB] document inserted!`);
    } catch (err) {
      console.info(`[Error] ${err}`);
    }
  },
  updateDoc: async (target, filter, doc, opt) => {
    try {
      const collection = client.db('todo').collection(target);
      const result = await collection.updateOne(filter, doc, opt);

      console.info(`[MongoDB] document updated!`);
    } catch (err) {
      console.info(`[Error] ${err}`);
    }
  },
  deleteDoc: async (target, query) => {
    try {
      const collection = client.db('todo').collection(target);
      await collection.deleteOne(query);

      if (result.deletedCount === 1) console.info(`[MongoDB] document deleted!`);
    } catch (err) {
      console.info(`[Error] ${err}`);
    }
  },
  readDoc: async (target, query, result) => {
    try {
      const collection = client.db('todo').collection(target);
      const cursor = await collection.find(query);

      await cursor.forEach(doc => result.push(doc));

      console.info(`[MongoDB] get documents!`);
    } catch (err) {
      console.info(`[Error] ${err}`);
    }
  }
}