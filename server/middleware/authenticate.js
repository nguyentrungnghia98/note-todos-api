var {User} = require('../models/user');

var authenticate = (req,res,next)=>{
    const token = req.header('x-auth');

    User.findByToken(token).then(user =>{
        if (!user){
            return  res.status(401).send();
        }
     //Because it is a middleware function we don't use method res.send(user);
     //Instead, we modify this req
     req.user = user;
     req.token = token;
     next();
     // We don't call next when the function has error
     // Because we don't want to anything next if has error
    }).catch(e =>{
        res.status(401).send(e);
    });
};

module.exports = {authenticate};