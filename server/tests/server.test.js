const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

var {app} = require('./../server');
var {Todo} = require('./../models/todo');

const todos = [{
  _id: new ObjectID(),
  text:"First test todo"
},{
  _id: new ObjectID(),
  text:"Second test todo",
  completed:true,
  completedAt:333
}];

beforeEach((done)=>{
  Todo.remove({}).then(()=>{
    return Todo.insertMany(todos);
  }).then(()=>done());
});

describe('POST /todos',()=>{
  it('should create a new todo',(done)=>{
    var text = 'Test to do text';

    request(app)
      .post('/todos')
      .send({text:text})
      .expect(200)
      .expect((res)=>{
        expect(res.body.text).toBe(text);
      })
      .end((err,res)=>{
        if(err){
          return done(err);
        }

        Todo.find({text}).then((todos)=>{
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((err)=>done(err));
      });
  });

  it('should not create todo with invalid body data',(done)=>{

    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err,res)=>{
        if(err){
          return done(err);
        }

        Todo.find().then((todos)=>{
          expect(todos.length).toBe(2);
          done();
        }).catch((e)=>done(e));
      });
  });
});

describe('GET /todos', ()=>{
  it('Should get all todos',(done)=>{
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res)=>{
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id',()=>{
  it('should return todo doc',(done)=>{
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return a 404 if todo not found',(done)=>{
    //make sure got a 404 back
    var id = new ObjectID();
    request(app)
      .get(`/todos/${id.toHexString()}`)
      .expect(404)
      .expect((res)=>{
        expect(res.body).toEqual({});
      })
      .end(done);
  });

  it('should return a 404 for non ObjectIDs',(done)=>{
    //todos/123
    request(app)
      .get('/todos/12345')
      .expect(404)
      .expect((res)=>{
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('DELE /todo/:id', ()=>{
  it('should remove a todo',(done)=>{
    var hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err)=>{
        if(err){
          return done(err);
        }

        //query database using findById toNotExist
        //expect(null).toNotExist();
        Todo.findById(hexId).then((todo)=>{
          expect(todo).toBeFalsy();
          done();
        }).catch((e)=>done(e));
      });
  });

  it('should return 404 when todo not found',(done)=>{
    var hexId = new ObjectID().toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 if ObjectID is inValid',(done)=>{
    request(app)
      .delete('/todos/12345')
      .expect(404)
      .end(done);
    });
});

describe('PATCH /todos/:id',()=>{
  it('should update the todo',(done)=>{
    //grab id of first item
    //update text,set completed to true
    //200
    //text is changed, completed is true, completedAt is number
    var hexId = todos[0]._id.toHexString();
    var text = 'AAAHHHHH!';

    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        text:text,
        completed:true
      })
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.text).toBe(text);
        // expect(res.body.todo.completedAt).toBeA('number');
      })
      .end((e)=>{
        if(e){
          return done(e);
        }
        done();
      });
  });

  it('should clear completed at when todo is not completed',(done)=>{
    //grab id of todo item
    //update text, set completed to false
    //200
    //test text changed if completed false and completedAt is null
    var hexId = todos[1]._id.toHexString();
    var text = 'HHOHOHO';

    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        text:text,
        completed:false
      })
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completedAt).toBeFalsy();
      })
      .end((e)=>{
        if(e){
          return done(e);
        }
        done();
      });
  });
});
