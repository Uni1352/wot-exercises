const MongoClient = require('mongodb').MongoClient;

MongoClient('mongodb://192.168.0.14:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err, db) => {
  if (err) throw err;

  console.info('[Info] Connected to MongoDB!');
  db.close();
});