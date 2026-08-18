const mongo = require('mongodb');
const getDb = require('../utils/databaseUtils').getDb;

module.exports = class Enquiry {
  constructor(name, phone, email, packageName, message, status) {
    this.name = name;
    this.phone = phone;
    this.email = email;
    this.package = packageName;
    this.message = message;
    this.status = status || 'Pending';
    this.createdAt = new Date();
  }

  save() {
    const db = getDb();
    return db.collection('enquiries').insertOne({
      name: this.name,
      phone: this.phone,
      email: this.email,
      package: this.package,
      message: this.message,
      status: this.status,
      createdAt: this.createdAt
    });
  }

  static fetchAll(callback) {
    const db = getDb();
    db.collection('enquiries')
      .find()
      .sort({ createdAt: -1 })
      .toArray()
      .then((enquiries) => {
        const mapped = enquiries.map((enquiry) => {
          enquiry.id = enquiry._id.toString();
          if (!enquiry.status) enquiry.status = 'Pending';
          return enquiry;
        });
        callback(mapped);
      })
      .catch((err) => {
        console.log(err);
        callback([]);
      });
  }

  static findById(enquiryId, callback) {
    const db = getDb();
    db.collection('enquiries')
      .findOne({ _id: new mongo.ObjectId(enquiryId) })
      .then((enquiry) => {
        if (enquiry) {
          enquiry.id = enquiry._id.toString();
        }
        callback(enquiry);
      })
      .catch((err) => {
        console.log(err);
        callback(null);
      });
  }

  static updateById(enquiryId, updatedData, callback) {
    const db = getDb();
    db.collection('enquiries')
      .updateOne(
        { _id: new mongo.ObjectId(enquiryId) },
        { $set: updatedData }
      )
      .then(() => callback())
      .catch((err) => {
        console.log(err);
        callback();
      });
  }

  static deleteById(enquiryId, callback) {
    const db = getDb();
    db.collection('enquiries')
      .deleteOne({ _id: new mongo.ObjectId(enquiryId) })
      .then(() => callback())
      .catch((err) => {
        console.log(err);
        callback();
      });
  }
};
