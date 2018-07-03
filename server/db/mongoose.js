var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://bobbysun8910:bobbysunabc123@ds125851.mlab.com:25851/todoapp' || 'mongodb://localhost:27017/TodoApp');


module.exports = {mongoose};
