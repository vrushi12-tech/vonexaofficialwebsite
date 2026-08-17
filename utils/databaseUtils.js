const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

const url = process.env.MONGODB_URI;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(url)
    .then((client) => {
      _db = client.db('vonexa');
      console.log("Connected to MongoDB successfully!");
      callback(client);
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
    });
};

const getDb = () => {
  if (!_db) {
    throw new Error("Database not connected yet");
  }

  return _db;
};

module.exports = mongoConnect;
module.exports.getDb = getDb;