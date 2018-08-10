const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app,Todo,User} = require('../server');
const {todos,users,populateTodos, populateUsers} = require('./seed/seed');

beforeEach(populateTodos);
beforeEach(populateUsers);

describe('POST /todos', ()=>{
    it ('should create a new todo', (done)=>{
        var text = 'test todo test';

        request(app)
        .post('/todos')
        .set('x-auth', users[0].tokens[0].token)
        .send({text})
        .expect(200)
        .expect((res)=>{
            expect(res.body.text).toBe(text);
        })
        //we want to end and check 
        //what got stored in the MongoDB
        //collection.
        .end((err,res)=>{
            if (err){
                return done(err);
            }
            Todo.find({text}).then((todos)=>{
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            })
            .catch((e)=>{
                done(e);
            })
            ;

        });
    });
    // This is going to be the test case that verifies that a 
    // todo does not get created when we send bad data
    it ('should not create todo with invalid data', (done)=>{
        request(app)
        .post('/todos')
        .set('x-auth', users[0].tokens[0].token)
        .send({})
        .expect(400)
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            Todo.find().then((todos)=>{
                expect(todos.length).toBe(2);
                done();
            })
            .catch((e)=>{
                done(e);
            });

        });
    });
});

describe('GET /todos',()=>{
    it ('should get all data',(done)=>{
        request(app)
        .get('/todos')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .end((err,res)=>{
            if (err){
                return done(err);
            }
            expect(res.body.todos.length).toBe(1);
            done();
        });
    });
});

describe('GET /todos/:id', ()=>{
    it ('should get data by valid id',(done)=>{
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end((done));
    });
});

describe('DELETE /todos/:id', ()=>{
    it ('should get data by valid id',(done)=>{
        const idHex = todos[0]._id.toHexString();
        request(app)
        .delete(`/todos/${idHex}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo._id).toBe(idHex);
        })
        .end((err,res)=>{
            if (err){
                return done(err);
            }
            Todo.findById(idHex).then((todo)=>{
                expect(todo).toBeFalsy();
                done();
            }).catch((e)=> done(e));
        });
    });
    it('should return 404 if todo not found',(done)=>{
        const idHex = new ObjectID();
        request(app)
        .delete(`/todos/${idHex}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });
    it('should return 404 if object ID is invalid',(done)=>{
        request(app)
        .delete(`/todos/123tests`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });
});

describe('PATCH /todos/:id',()=>{
    it('should update to todo',(done)=>{
        const idHex = todos[0]._id.toHexString();
        const text = "Testing update with PATCH";
        request(app)
        .patch(`/todos/${idHex}`)
        .set('x-auth', users[0].tokens[0].token)
        .send({
            text, 
            completed:true
        })
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(true);
            expect(typeof res.body.todo.completeAt).toBe('number');
        })
        .end(done);
    });

});
// ******************* USER *********************
describe('POST /users/',()=>{
    it('should create a new user',(done)=>{
        const newUser = {
            email:'test3@gmail.com',
            password:'myPass123'
        };
        request(app)
        .post('/users')
        .send(newUser)
        .expect(200)
        .expect(res =>{
            expect(res.headers['x-auth']).toBeTruthy();
            expect(res.body._id).toBeTruthy();
            expect(res.body.email).toBe(newUser.email);
        })
        //make sure that MongoDB save it
        .end((err,res)=>{
            if (err){
                return done(err);
            }
            User.findOne({email:newUser .email}).then(user =>{
                expect(user).toBeTruthy();
                expect(user.password).not.toBe(newUser.password);
                done();
            }).catch(e =>{
                done(e);
            });
        });
    });

    it('should not create a new user when data is not valid',(done)=>{
        request(app)
        .post('/users')
        .send({})
        .expect(400)
        .end((err,res)=>{
            if (err){
                return done(err);
            }
            User.find().then(users=>{
                expect(users.length).toBe(2);
                done();
            }).catch(done);
        });
    });
});

describe('POST /users/login',()=>{
    it('Should login to server',(done)=>{
        request(app)
        .post('/users/login')
        .send({
            email:users[1].email,
            password:users[1].password
        })
        .expect(200)
        .expect(res =>{
            expect(res.headers['x-auth']).toBeTruthy();
        })
        .end((err,res)=>{
            if (err){
                return done(err);
            }
            User.findById(users[1]._id).then(user =>{
                expect({
                    access:user.tokens[1].access,
                    token: user.tokens[1].token
                }).toEqual({
                    access:'auth',
                    token: res.headers['x-auth']
                })
                
                done();
            }).catch(e =>{
                done(e);
            });
        });
    });
});

