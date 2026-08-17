const mongo = require('mongodb');
const getDb = require('../utils/databaseUtils').getDb;

module.exports = class Client {
  constructor(name, phone, email, packageName, amount, completedOn, notes) {
    this.name = name;
    this.phone = phone;
    this.email = email;
    this.package = packageName;
    this.amount = Number(amount) || 0;
    this.completedOn = completedOn ? new Date(completedOn) : new Date();
    this.notes = notes;
    this.createdAt = new Date();
  }

  save() {
    const db = getDb();
    return db.collection('completedClients').insertOne({
      name: this.name,
      phone: this.phone,
      email: this.email,
      package: this.package,
      amount: this.amount,
      completedOn: this.completedOn,
      notes: this.notes,
      createdAt: this.createdAt
    });
  }

  static fetchAll(callback) {
    const db = getDb();
    db.collection('completedClients')
      .find()
      .sort({ completedOn: -1 })
      .toArray()
      .then((clients) => {
        const mapped = clients.map((client) => {
          client.id = client._id.toString();
          return client;
        });
        callback(mapped);
      })
      .catch((err) => {
        console.log(err);
        callback([]);
      });
  }

  static findById(clientId, callback) {
    const db = getDb();
    db.collection('completedClients')
      .findOne({ _id: new mongo.ObjectId(clientId) })
      .then((client) => {
        if (client) {
          client.id = client._id.toString();
        }
        callback(client);
      })
      .catch((err) => {
        console.log(err);
        callback(null);
      });
  }

  static deleteById(clientId, callback) {
    const db = getDb();
    db.collection('completedClients')
      .deleteOne({ _id: new mongo.ObjectId(clientId) })
      .then(() => callback())
      .catch((err) => {
        console.log(err);
        callback();
      });
  }
};
