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
    console.log(`[Info] Connect successfully to server!`);

    const db = client.db(dbName);
    const collection = db.collection('Person');

    const docs = [{
      id: 1,
      firstName: 'Steve',
      lastName: 'Jobs'
    }, {
      id: 2,
      firstName: 'Bill',
      lastName: 'Gates'
    }];
    const options = {
      ordered: true
    };
    await insertDocs(collection, docs, options);

    const query = {
      id: 2
    };
    await deleteDocs(collection, query);

    const filter = {
      id: 1
    };
    const update = {
      $set: {
        firstName: 'James',
        lastName: 'Gosling'
      }
    }
    await updateDocs(collection, filter, update);
  } catch (err) {
    console.log(`[Error] ${err}`);
  } finally {
    await client.close();
    console.log(`[Info] Disconnect!`);
  }
}

async function insertDocs(collection, docs, opt) {
  const result = await collection.insertMany(docs, opt);

  console.info(`${result.insertedCount} documents were inserted!`);
}

async function updateDocs(collection, filter, update) {
  const result = await collection.updateOne(filter, update);

  console.log(`${result.matchedCount} document(s) matched the filter, ${result.modifiedCount} document(s) updated!`);
}

async function deleteDocs(collection, query) {
  const result = await collection.deleteOne(query);

  if (result.deletedCount === 1) console.info('Successfully deleted one document!');
  else console.log('No documents matched the query. Deleted 0 documents.');
}

run();