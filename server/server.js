var express= require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
    var todo= new Todo({
        text: req.body.text
    });

    todo.save().then((doc)=>{
        res.send(doc);
    }, (err)=>{
       res.status(400).send(e);
    });
});

app.listen(3000, ()=>{
    console.log('Started on port 3000');
});
// var newTodo = new Todo({
//     text:'   Learn  NodeJS  '
// });

// newTodo.save().then((doc)=>{
//     console.log(JSON.stringify(doc,undefined,2) );
// }, (err)=>{
//     console.log('Unable to save data',err);
// });


// var newUser = new User({
//     email:' ntn641998@gmail.com'
// });

// newUser.save().then((doc)=>{
//     console.log(JSON.stringify(doc,undefined,2) );
// }, (err)=>{
//     console.log('Unable to save data',err);
// });