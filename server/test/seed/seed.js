
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');
const idUser1 = new ObjectID();
const idUser2 = new ObjectID();
const todos = [{
    text:'First test todo',
    _id: new ObjectID(),
    _creator:idUser1
},{
    _id: new ObjectID(),
    text:'Second test todo',
    completed: true,
  completedAt: 333,
    _creator: idUser2
}];

const users = [{
    _id:idUser1,
    email:'test1@gmail.com',
    password:'myPass123',
    tokens:[{
        access: 'auth',
        token: jwt.sign({_id: idUser1, access:'auth'}, process.env.JWT_SECRET).toString()
    }]
},{
    _id:idUser2,
    email:'test2@yahoo.com',
    password:'myPass123',
    tokens:[{
        access: 'auth',
        token: jwt.sign({_id: idUser2, access:'auth'}, process.env.JWT_SECRET).toString()
    }]
}];

const populateTodos = (done) =>{
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todos);
    }).then(()=> done());
};

const populateUsers = (done) =>{
    User.remove({}).then(()=>{
       var userOne = new User(users[0]).save();
       var userTwo = new User(users[1]).save();
       // the method save is the promise. So we need to way for both
       // of them to succeed
       return Promise.all([userOne,userTwo]);
    }).then(()=> done());
};
module.exports = {
    todos,users,populateTodos, populateUsers
}