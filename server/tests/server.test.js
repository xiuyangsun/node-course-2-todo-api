const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos,populaTodos,users,populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populaTodos);

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

describe('GET /users/me',() =>{
  it('should return user if authenticate',(done)=>{
    request(app)
      .get('/users/me')
      .set('x-auth',users[0].tokens[0].token)
      .expect(200)
      .expect((res)=>{
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticate',(done)=>{
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res)=>{
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users',()=>{
  it('should create a user',(done)=>{
    var email = 'examp@example.com';
    var password = 'abc123';
    request(app)
      .post(`/users`)
      .send({email,password})
      .expect(200)
      .expect((res)=>{
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end((err)=>{
        if(err){
          return done(err);
        }

        User.findOne({email}).then((user)=>{
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(password);
          done();
        }).catch((e)=>done(e));
      });
  });

  it('should return validation errors if request invalid',(done)=>{
    //400
    var email = 'aaaa';
    var password = '123';
    request(app)
      .post('/users')
      .send({email,password})
      .expect(400)
      .end(done);

  });

  it('should not create user if email in use',(done)=>{
    //400
    var email = users[0].email;
    var password = 'hahaha121';

    request(app)
      .post('/users')
      .send({email,password})
      .expect(400)
      .end(done);

  });
});

describe('POST /users/login', ()=>{
  it('should login user and return auth token',(done)=>{
    request(app)
      .post('/users/login')
      .send({
        email:users[1].email,
        password:users[1].password
      })
      .expect(200)
      .expect((res)=>{
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end((err,res)=>{
        if(err){
          return done(err);
        }

        User.findById(users[1]._id).then((user)=>{
          expect(user.tokens[0]).toMatchObject({
            access:'auth',
            token:res.headers['x-auth']
          });
          done();
        }).catch((e)=>done(e));
      });
  });

  it('should reject invalid login', (done)=>{
    request(app)
      .post('/users/login')
      .send({
        email:users[1].email,
        password:users[0].password
      })
      .expect(400)
      .expect((res)=>{
        expect(res.headers['x-auth']).toBeFalsy();
      })
      .end((err,res)=>{
        if(err){
          return done(err);
        }

        User.findById(users[1]._id).then((user)=>{
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e)=>done(e));
      });
  })
});
