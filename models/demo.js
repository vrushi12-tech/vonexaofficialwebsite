const mongo = require('mongodb');
const getDb = require('../utils/databaseUtils').getDb;

module.exports = class Demo {
  constructor(title, description, imageUrl, link, videoUrl) {
    this.title = title;
    this.description = description;
    this.imageUrl = imageUrl;
    this.link = link;
    this.videoUrl = videoUrl;
    this.createdAt = new Date();
  }

  save() {
    const db = getDb();
    return db.collection('demos').insertOne({
      title: this.title,
      description: this.description,
      imageUrl: this.imageUrl,
      link: this.link,
      videoUrl: this.videoUrl,
      createdAt: this.createdAt
    });
  }

  static fetchAll(callback) {
    const db = getDb();
    db.collection('demos')
      .find()
      .sort({ createdAt: -1 })
      .toArray()
      .then((demos) => {
        const mapped = demos.map((demo) => {
          demo.id = demo._id.toString();
          return demo;
        });
        callback(mapped);
      })
      .catch((err) => {
        console.log(err);
        callback([]);
      });
  }

  static deleteById(demoId, callback) {
    const db = getDb();
    db.collection('demos')
      .deleteOne({ _id: new mongo.ObjectId(demoId) })
      .then(() => callback())
      .catch((err) => {
        console.log(err);
        callback();
      });
  }
};