const mongo = require('mongodb');
const getDb = require('../utils/databaseUtils').getDb;

module.exports = class Favourite {
  static fetchAll(callback) {
    const db = getDb();
    db.collection('favourites')
      .find()
      .toArray()
      .then((favourites) => {
        const ids = favourites.map((fav) => fav.homeId.toString());
        callback(ids);
      })
      .catch((err) => {
        console.log(err);
        callback([]);
      });
  }

  static addById(homeId, callback) {
    const db = getDb();
    db.collection('favourites')
      .findOne({ homeId: new mongo.ObjectId(homeId) })
      .then((existing) => {
        if (existing) {
          callback();
        } else {
          db.collection('favourites')
            .insertOne({ homeId: new mongo.ObjectId(homeId) })
            .then(() => callback())
            .catch((err) => {
              console.log(err);
              callback();
            });
        }
      })
      .catch((err) => {
        console.log(err);
        callback();
      });
  }

  static deleteById(homeId, callback) {
    const db = getDb();
    db.collection('favourites')
      .deleteOne({ homeId: new mongo.ObjectId(homeId) })
      .then(() => callback())
      .catch((err) => {
        console.log(err);
        callback();
      });
  }
};
