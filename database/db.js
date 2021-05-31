function connection(err, db) {
  if (err) throw (err);

  console.log('MongoDB is Running!');
  db.close();
}

module.exports = {
  connectToDB: connection
}