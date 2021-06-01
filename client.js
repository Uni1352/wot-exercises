const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://192.168.0.14:27017'
const dbName = 'test';
const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}
// const client = new MongoClient(url, config);

// client.connect((err) => {
//   console.log("[Info] Connected successfully to server");
//   try {
//     const collection = client.db(dbName).collection('Person');

//     // insert
//     collection.insertMany([{
//       id: 1,
//       firstName: 'Steve',
//       lastName: 'Jobs'
//     }, {
//       id: 2,
//       firstName: 'Bill',
//       lastName: 'Gates'
//     }], (err) => {
//       if (err) console.log(err);
//       console.info('[Info] Inserting Data...');
//     });

//     // update
//     collection.updateOne({
//       id: 1
//     }, {
//       $set: {
//         firstName: 'James',
//         lastName: 'Gosling'
//       }
//     }, {
//       w: 1
//     }, (err) => {
//       if (err) console.log(err);
//       console.info('[Info] Updating Data...');
//     });

//     // delete
//     collection.deleteOne({
//       id: 2
//     }, {
//       w: 1
//     }, (err) => {
//       if (err) console.log(err);
//       console.info('[Info] Deleting Data...');
//     });
//   } finally {
//     console.info('DONE!');
//   }
// });

MongoClient.connect(url, config).then((client) => {
  console.log("mongo db connection success");
}).catch(err => {
  console.log("connection failure.... ", url);
  console.log("connection error ", err);
})