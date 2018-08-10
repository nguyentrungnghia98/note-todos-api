require('./config/config');

var express= require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {ObjectID} = require('mongodb');
var _= require('lodash');
var app = express();
var {authenticate} = require('./middleware/authenticate');

app.use(bodyParser.json());

app.post('/todos',authenticate,(req,res)=>{
    var todo= new Todo({
        text: req.body.text,
        _creator:req.user._id
    });

    todo.save().then((doc)=>{
        res.send(doc);
    }, (e)=>{
       res.status(400).send(e);
    });
});

app.get('/todos',authenticate, (req,res)=>{
    Todo.find({
        _creator : req.user._id
    }).then((todos)=>{
        res.send({
            todos
        });
    }, (e)=>{
        res.status(400).send(e);
    });
});

//GET /todos/5b66dcb95478940ebc80720a
app.get('/todos/:id',authenticate, (req,res)=>{
    const id = req.params.id;
    //valid id using isValid
    //404 - send back empty value
    if(!ObjectID.isValid(id)){
       return res.status(404).send();
    }
    Todo.findOne({
        _id:id,
        _creator : req.user._id
    }).then((todo)=>{
        if(!todo){
          return  res.status(404).send();
        }
        res.send({todo});
    })
    .catch((e)=> res.status(400).send());

});

//DELETE /todos/5b66dcb95478940ebc80720a
app.delete('/todos/:id',authenticate, (req,res)=>{
    const id = req.params.id;
    //valid id using isValid
    //404 - send back empty value
    if(!ObjectID.isValid(id)){
       return res.status(404).send();
    }
    Todo.findOneAndRemove({
        _id:id,
        _creator : req.user._id
    }).then((todo)=>{
        if(!todo){
          return  res.status(404).send();
        }
        res.send({todo});
    })
    .catch((e)=> res.status(400).send());

});

//PATCH /todos/5b67cafa29f2611ab4abc76b
app.patch('/todos/:id',authenticate, (req,res)=>{
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
     Todo.findOneAndUpdate({_id:id, _creator : req.user._id},{$set:body},{new: true}).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        
        res.send({todo});
     })
     .catch((e) => res.status(400).send());
});


//POST /users/
app.post('/users/', (req,res)=>{
    var user = new User(_.pick(req.body,['email','password']));

    user.save().then(() =>{
       return user.generateAuthToken();
    }).then((token) =>{
        res.header('x-auth',token).send(user);
    }).catch((e) =>{
        res.status(400).send(e);
    });
   
});

//GET /users/me
app.get('/users/me',authenticate, (req,res)=>{
    res.send(req.user);
});

// POST /users/login {email,password}
app.post('/users/login',(req,res)=>{
    // get email, password -> check password -> res.send(user)
    var body = _.pick(req.body,['email','password']);
    User.findByCredentials(body.email,body.password).then(user=>{
       return user.generateAuthToken().then(token=>{
        res.header('x-auth',token).send(user);
       });
    }).catch(e =>{
        res.status(401).send(e);
    });
});

//DELETE /users/me/token
app.delete('/users/me/token',authenticate,(req,res)=>{
    req.user.removeToken(req.token).then(()=>{
        res.status(200).send();
    },()=>{
        res.status(400).send();
    });
});
app.listen(process.env.PORT, ()=>{
    console.log('Started on port ',process.env.PORT);
});

module.exports = {app,Todo,User};