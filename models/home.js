const mongo = require('mongodb');
const getDb = require('../utils/databaseUtils').getDb;

module.exports = class Homes {
  constructor(homeaddress, price, location, ratings, image) {
    this.homeaddress = homeaddress;
    this.price = price;
    this.location = location;
    this.ratings = ratings;
    this.image = image;
  }

  save() {
    const db = getDb();
    return db.collection('homes').insertOne({
      homeaddress: this.homeaddress,
      price: this.price,
      location: this.location,
      ratings: this.ratings,
      image: this.image
    });
  }

  static fetchAll(callback) {
    const db = getDb();
    db.collection('homes')
      .find()
      .toArray()
      .then((homes) => {
        const mapped = homes.map((home) => {
          home.id = home._id.toString();
          return home;
        });
        callback(mapped);
      })
      .catch((err) => {
        console.log(err);
        callback([]);
      });
  }

  static findById(homesId, callback) {
    const db = getDb();
    db.collection('homes')
      .findOne({ _id: new mongo.ObjectId(homesId) })
      .then((home) => {
        if (home) {
          home.id = home._id.toString();
        }
        callback(home);
      })
      .catch((err) => {
        console.log(err);
        callback(null);
      });
  }

  static updateById(homesId, updatedData, callback) {
    const db = getDb();
    db.collection('homes')
      .updateOne(
        { _id: new mongo.ObjectId(homesId) },
        { $set: updatedData }
      )
      .then(() => callback())
      .catch((err) => {
        console.log(err);
        callback();
      });
  }

  static deleteById(homesId, callback) {
    const db = getDb();
    db.collection('homes')
      .deleteOne({ _id: new mongo.ObjectId(homesId) })
      .then(() => callback())
      .catch((err) => {
        console.log(err);
        callback();
      });
  }
};
