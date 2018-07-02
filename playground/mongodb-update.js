//const MongoClient = require('mongodb').MongoClient;
const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
  if(err){
    return console.log('Unable to connect to MongoDB server.');
  }
  debugger;
  console.log('Connected to MongoDB server.');

  //findOneAndUpdate

  // db.collection('Todos').findOneAndUpdate({
  //   _id:new ObjectID("5b3a7fea6b64a2c5ab5e02d8")
  // },{
  //   $set:{
  //     completed:true
  //   }
  // },{
  //   returnOriginal:false
  // }).then((result)=>{
  //   console.log(result);
  // });

  db.collection('Users').findOneAndUpdate({
    _id:new ObjectID("5b3a6af1625ebe2ee0a7a406")
  },{
    $set:{name:'Tudou'},
    $inc:{age:-1}
  },{
    returnOriginal:false
  }).then((result)=>{
    console.log(result);
  });

  //db.close();
});
