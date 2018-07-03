var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
  var todo = new Todo({
    text:req.body.text
  });

  todo.save().then((doc)=>{
    res.send(doc);
  },(err)=>{
    res.status(400).send(err);
  });
});

app.listen(3000,()=>{
  console.log('Started on port 3000');
});

module.exports = {
  app
};
// var newTodo = new Todo({
//   text:"Cook dinner"
// });
//
// newTodo.save().then((doc)=>{
//   console.log('Saved Todo',JSON.stringify(doc,undefined,2));
// },(e)=>{
//   console.log('Unable to save todo.',e)
// });

// var newTodo2 = new Todo({
//   text:"  Edit this vedio  "
// });
//
//
// newTodo2.save().then((res)=>{
//   console.log(JSON.stringify(res,undefined,2));
// },(err)=>{
//   console.log('Unable to add todo2',err);
// });

//User
//Email


// var newUser = new User({
//   email:"walawala@gmail.com"
// });
//
// newUser.save().then((res)=>{
//   console.log(JSON.stringify(res,undefined,2));
// },(err)=>{
//   console.log('Unable to add new user',err);
// });
