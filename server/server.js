require('./config/config');

var express= require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {ObjectID} = require('mongodb');
var _= require('lodash');
var app = express();

app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
    var todo= new Todo({
        text: req.body.text
    });

    todo.save().then((doc)=>{
        res.send(doc);
    }, (e)=>{
       res.status(400).send(e);
    });
});

app.get('/todos', (req,res)=>{
    Todo.find({}).then((todos)=>{
        res.send({
            todos
        });
    }, (e)=>{
        res.status(400).send(e);
    });
});

//GET /todos/5b66dcb95478940ebc80720a
app.get('/todos/:id', (req,res)=>{
    const id = req.params.id;
    //valid id using isValid
    //404 - send back empty value
    if(!ObjectID.isValid(id)){
       return res.status(404).send();
    }
    Todo.findById(id).then((todo)=>{
        if(!todo){
          return  res.status(404).send();
        }
        res.send({todo});
    })
    .catch((e)=> res.status(400).send());

});

//DELETE /todos/5b66dcb95478940ebc80720a
app.delete('/todos/:id', (req,res)=>{
    const id = req.params.id;
    //valid id using isValid
    //404 - send back empty value
    if(!ObjectID.isValid(id)){
       return res.status(404).send();
    }
    Todo.findByIdAndRemove(id).then((todo)=>{
        if(!todo){
          return  res.status(404).send();
        }
        res.send({todo});
    })
    .catch((e)=> res.status(400).send());

});

//PATCH /todos/5b67cafa29f2611ab4abc76b
app.patch('/todos/:id', (req,res)=>{
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
     }
    // body only includes text and comleted because we cannot change _id or completedAt.
     var body = _.pick(req.body,['text','completed']);
     if(_.isBoolean(body.completed)  &&  body.completed){
        body.completeAt = new Date().getTime();
    }else{
        body.completed = false;
        body.completeAt = null;
    }
    // find ID and update equal body
     Todo.findByIdAndUpdate(id,{$set:body},{new: true}).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        
        res.send({todo});
     })
     .catch((e) => res.status(400).send());
});

app.listen(process.env.PORT, ()=>{
    console.log('Started on port ',process.env.PORT);
});

module.exports = {app,Todo};