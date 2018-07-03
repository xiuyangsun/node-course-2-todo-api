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
  text:"Second test todo"
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
