const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {app,Todo} = require('../server');
//Make sure the database is empty, and create two document
const todos = [{
    text:'First test todo',
    _id: new ObjectID()
},{
    _id: new ObjectID(),
    text:'Second test todo'
}];
beforeEach((done)=>{
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todos);
    }).then(()=> done());
});

describe('POST /todos', ()=>{
    it ('should create a new todo', (done)=>{
        var text = 'test todo test';

        request(app)
        .post('/todos')
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
            Todo.find().then((todos)=>{
                expect(todos.length).toBe(3);
                expect(todos[2].text).toBe(text);
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
        .expect(200)
        .end((err,res)=>{
            if (err){
                return done(err);
            }
            Todo.find({}).then((todos)=>{
                expect(todos.length).toBe(res.body.todos.length);
                done();
            })
            .catch((e)=>{
                done(e);
            });
        });
    });
});

describe('GET /todos/:id', ()=>{
    it ('should get data by valid id',(done)=>{
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });
});