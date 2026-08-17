const mongo = require('mongodb');
const getDb = require('../utils/databaseUtils').getDb;

module.exports = class Service {
  constructor(name, category, tagline, price, unit, badge, icon, features) {
    this.name = name;
    this.category = category;
    this.tagline = tagline;
    this.price = Number(price) || 0;
    this.unit = unit;
    this.badge = badge || null;
    this.icon = icon || '✦';
    this.features = Array.isArray(features)
      ? features
      : (features || '').split('\n').map((f) => f.trim()).filter(Boolean);
    this.createdAt = new Date();
  }

  save() {
    const db = getDb();
    return db.collection('services').insertOne({
      name: this.name,
      category: this.category,
      tagline: this.tagline,
      price: this.price,
      unit: this.unit,
      badge: this.badge,
      icon: this.icon,
      features: this.features,
      createdAt: this.createdAt
    });
  }

  static fetchAll(callback) {
    const db = getDb();
    db.collection('services')
      .find()
      .sort({ category: 1, price: 1 })
      .toArray()
      .then((services) => {
        const mapped = services.map((service) => {
          service.id = service._id.toString();
          return service;
        });
        callback(mapped);
      })
      .catch((err) => {
        console.log(err);
        callback([]);
      });
  }

  static findById(serviceId, callback) {
    const db = getDb();
    db.collection('services')
      .findOne({ _id: new mongo.ObjectId(serviceId) })
      .then((service) => {
        if (service) {
          service.id = service._id.toString();
        }
        callback(service);
      })
      .catch((err) => {
        console.log(err);
        callback(null);
      });
  }

  static updateById(serviceId, updatedData, callback) {
    const db = getDb();
    db.collection('services')
      .updateOne(
        { _id: new mongo.ObjectId(serviceId) },
        { $set: updatedData }
      )
      .then(() => callback())
      .catch((err) => {
        console.log(err);
        callback();
      });
  }

  static deleteById(serviceId, callback) {
    const db = getDb();
    db.collection('services')
      .deleteOne({ _id: new mongo.ObjectId(serviceId) })
      .then(() => callback())
      .catch((err) => {
        console.log(err);
        callback();
      });
  }
};
