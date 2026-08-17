const mongo = require('mongodb');
const getDb = require('../utils/databaseUtils').getDb;

module.exports = class Review {
  constructor(name, rating, packageName, message) {
    this.name = name;
    this.rating = Math.min(5, Math.max(1, Number(rating) || 5));
    this.package = packageName;
    this.message = message;
    this.createdAt = new Date();
  }

  save() {
    const db = getDb();
    return db.collection('reviews').insertOne({
      name: this.name,
      rating: this.rating,
      package: this.package,
      message: this.message,
      createdAt: this.createdAt
    });
  }

  static fetchAll(callback) {
    const db = getDb();
    db.collection('reviews')
      .find()
      .sort({ createdAt: -1 })
      .toArray()
      .then((reviews) => {
        const mapped = reviews.map((review) => {
          review.id = review._id.toString();
          return review;
        });
        callback(mapped);
      })
      .catch((err) => {
        console.log(err);
        callback([]);
      });
  }

  static deleteById(reviewId, callback) {
    const db = getDb();
    db.collection('reviews')
      .deleteOne({ _id: new mongo.ObjectId(reviewId) })
      .then(() => callback())
      .catch((err) => {
        console.log(err);
        callback();
      });
  }
};
