require('./config/config.js');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');


var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {mongoose} = require('./db/mongoose');
var app = express();
const port = process.env.PORT;

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

app.get('/todos',(req,res)=>{
  Todo.find().then((todos)=>{
    res.send({todos});
  },(err)=>{
    res.status(400).send(err);
  });
});

//GET /todos/12345
app.get('/todos/:id',(req,res)=>{
  var id = req.params.id;
  //valid ID using ObjectID isValid
    //404 - send back empty body
    if(!ObjectID.isValid(id)){
      return res.status(404).send({});
    }
    //findByID
      //success
        //if todo -send it back
        //if no todo - send back a 404 with empty body
      //error
        //400 - and send empty body back

    Todo.findById(id).then((todo)=>{
      if(!todo){
        return res.status(404).send({});
      }
      res.send({todo});
    }).catch((e)=>{
      res.status(400).send({});
    });

});

app.delete('/todos/:id',(req,res)=>{
  //get the id
  var id = req.params.id;
  //no valid - return a 404
if(!ObjectID.isValid(id)){
  return res.status(404).send();
}
  //remove todo by id
    //success
      //not exist - send 404
      //exist - send back
    //error - send 400 empty body

    Todo.findByIdAndRemove(id).then((todo)=>{
      if(!todo){
        return res.status(404).send();
      }
      res.send({todo});
    }).catch((e)=>{
      res.status(400).send();
    });
});

app.patch('/todos/:id',(req,res)=>{
  var id = req.params.id;
  var body = _.pick(req.body,['text','completed']);

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id,{$set:body},{new:true}).then((todo)=>{
    if(!todo){
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e)=>{
    res.status(400).send();
  })
});

//POST /users
app.post('/users',(req,res)=>{
  var body = _.pick(req.body,['email','password']);
  var user = new User(body);

  user.save().then(()=>{
    return user.generateAuthToken();
  }).then((token)=>{
    res.header('x-auth',token).send(user);
  }).catch((e)=>{
    res.status(400).send(e);
    console.log(e);
  })
});

app.listen(port,()=>{
  console.log(`Started on port${port}`);
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
