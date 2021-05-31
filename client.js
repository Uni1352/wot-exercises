const mongoClient = require('mongodb').MongoClient;
const curd = require('./db/db');


mongoClient.connect('mongodb://localhost:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err, db) => {
  if (err) throw err;

  console.info('[Info] Connected to MongoDB!');
  db.close();
});