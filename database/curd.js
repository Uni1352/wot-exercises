module.exports = {
  connection: (err, db) => {
    if (err) throw err;

    console.info('[Info] Connected to MongoDB!');
    db.close();
  }
}