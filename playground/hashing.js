const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');


var data = {
  id:10
};

var token = jwt.sign(data,'abc123');
console.log(token);
// jwt.verify
var decoded = jwt.verify(token,'abc123');
console.log(decoded);

// var message = "I'm user No 3.";
// var hash = SHA256(message).toString();
//
// console.log(`Message:${message} \nHash:${hash}`);
//
//
// var data = {
//   id:4
// };
//
// var token = {
//   data,
//   hash:SHA256(JSON.stringify(data)+'somesecret').toString()
// }
//
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// var resultHash = SHA256(JSON.stringify(token.data)+'somesecret').toString();
//
// if(resultHash === token.hash){
//   console.log('data was not changed')
// } else{
//   console.log("data was changed, don't trust.");
// }
