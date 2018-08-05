var mongoose = require('mongoose');

var Todo = mongoose.model('Todo',{
    text:{
        type:String,
        require:true,
        minlength:1,
        trim: true
    },
    completed:{
        type: Boolean,
        default:false
    },
    completeAt:{
        type: Number,
        default:0
    }
});

module.exports = {Todo};