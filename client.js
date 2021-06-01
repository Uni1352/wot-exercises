const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://192.168.0.14:27017/test'
const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 5000,
  socketTimeoutMS: 5000
}

MongoClient.connect(url, config, (err, db) => {
  try {
    console.info('[Info] Connected to MongoDB!');
  } catch (err) {
    console.info(err);
  } finally {
    db.close();
  }

});