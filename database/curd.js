module.exports = {
  connection: (err, db) => {
    if (err) throw err;

    console.log('MongoDB is Running!');
    db.close();
  }
}