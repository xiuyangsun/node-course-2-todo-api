const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


// var id = '5b3b8fb2642b3e39a0210ea41';
//
// if(!ObjectID.isValid(id)){
//   console.log('ID not Valid');
// }

// Todo.find({
//   _id:id
// }).then((todos)=>{
//   console.log('Todos',todos);
// });
//
// Todo.findOne({
//   _id:id
// }).then((todo)=>{
//   console.log('Todo',todo);
// });

// Todo.findById(id).then((todo)=>{
//   if(!todo){
//     return console.log('ID not found');
//   }
//   console.log('Todo By ID',todo);
// }).catch((err)=>{
//   console.log(err);
// });

var id = '5b3a995f65fbba36300d6de3';

User.findById(id).then((user)=>{
  if(!user){
    return console.log('ID not found');
  }
  console.log('User:',user);
}).catch((e)=>{
  console.log(e);
});
