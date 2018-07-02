//const MongoClient = require('mongodb').MongoClient;
const {MongoClient,ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

//ES6 Object destructure
// var user = {name:"Bobby", age:28};
// var {name} = user;
// console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
  if(err){
    return console.log('Unable to connect to MongoDB server.');
  }
  debugger;
  console.log('Connected to MongoDB server.');

  // db.collection('Todos').insertOne({
  //   text:'Something to do',
  //   completed:false
  // },(err,result)=>{
  //   if (err){
  //     return console.log('Unable to insert to do.',err);
  //   }
  //
  //   console.log(JSON.stringify(result.ops,undefined,2));
  // });

  //Insert new doc intp Users(name, age, location).
//   db.collection('Users').insertOne({
//     name:'Bobby',
//     age:28,
//     location:'Maryland'
//   },(err,result)=>{
//     if(err){
//       return console.log('Unsble to insert new user',err);
//     }
//
//     console.log(result.ops[0]._id.getTimestamp());
//   });
//
  db.close();
});
