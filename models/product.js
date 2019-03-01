const getDb = require('../util/database').getDb;
const ObjectId = require('mongodb').ObjectID;
const mongoDb = require('mongodb');

class Product {
  constructor(title, price, description, imageUrl, id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id= id ? ObjectId(id) : null;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      console.log('going');
      dbOp = db
        .collection('products')
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection('products').insertOne(this);
    }
    return dbOp
      .then(result => {
        return result;
      })
      .catch(err => {
        console.log(err);
      });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('products')
      .find()
      .toArray()
      .then(products => {
        console.log(products);
        return products;
      })
      .catch(err => {
        console.log(err);
      });
  }

  static findById(prodId) {
    const db = getDb();
    return (
      db
        .collection('products')
        // .find({ _id: ObjectId(prodId) })
        .find({ _id: new mongoDb.ObjectId(prodId) })
        .next()
        .then(product => {
          console.log(product);
          return product;
        })
        .catch(err => {
          console.log(err);
        })
    );
  }

  static deleteById(prodId){
    const db=getDb();
    return db.collection('products').deleteOne({_id:new ObjectId(prodId)})
    .then(()=>{
      console.log('deleted');
    }).catch(err=>{
      console.log(err);
    });
  }

}

module.exports = Product;

// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// module.exports = sequelize.define('product', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   title: Sequelize.STRING,
//   price: {
//     type: Sequelize.DOUBLE,
//     allowNull: false
//   },
//   imageUrl: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   description: {
//     type: Sequelize.STRING,
//     allowNull: false
//   }
// });
