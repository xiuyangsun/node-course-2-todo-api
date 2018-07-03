const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result)=>{
//   console.log(result);
// });

//Todo.findOneAndRemove
// Todo.findOneAndRemove({'_id'}).then((todo){
//
// });

Todo.findByIdAndRemove('5b3bc63b6b64a2c5ab5e1fa3').then((todo)=>{
  console.log(todo);
});
