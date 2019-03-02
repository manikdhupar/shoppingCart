const getDb = require('../util/database').getDb;
const mongoDb=require('mongodb');
const ObjectId=mongoDb.ObjectId;

class User{
  constructor(username,email){
    this.username=username;
    this.email=email;
  }

  save(){
    const db=getDb();
    return db.collection('users').insertOne(this)
    .then(user=>{
      console.log('created User');
      return user;
    }).catch(err=>{
      console.log(err);
    })
  }

  static findById(userId){
    const db=getDb();
    return db.collection('users').findOne({_id : new ObjectId(userId)})
    .then(user=>{
      console.log('created user');
      return user;
    })
    .catch(err=>{
      console.log(err);
    });
  }

}

module.exports=User;