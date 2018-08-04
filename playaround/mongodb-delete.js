
const {MongoClient,ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err,client)=>{
    if(err){
       return console.log('Unable to connect to MongoDB Server');
    }
    console.log('Connected to MongoDB Server');
    const db = client.db('TodoApp');

    //deleteMany
    db.collection('Todos').deleteMany({text:'Eat Luch'}).then((result)=>{
        console.log(result);
    });
    //deleteOne
    db.collection('Todos').deleteOne({text:'Play Game'}).then((result)=>{
        console.log(result);
    });
    //findOneAndDelete
    db.collection('Todos').findOneAndDelete({text:'Something to do'}).then((result)=>{
        console.log(result);
    });
});