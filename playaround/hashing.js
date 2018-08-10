var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

const password = 'myPass123';

// // 10 is number of rounds to use
// bcrypt.genSalt(10, (err,salt)=>{
//     //We start hash password in here
//     bcrypt.hash(password,salt,(err,hash)=>{
//         // hash is the result
//         console.log(hash);
//     });
// });

var hashPassword = '$2a$10$2FWql7cD6TYA9WufTUolc.Ilg0HWUMPjuBBsYq5IFKuJzZXZtj4JO';
bcrypt.compare(password,hashPassword, (err,res)=>{
    console.log(res);
});