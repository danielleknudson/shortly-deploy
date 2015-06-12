var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Use production URI if in production environment, 
// else use localhost
var mongoURI = process.env.MONGOLAB_URI || 'mongodb://localhost/bittydb';
mongoose.connect(mongoURI);
console.log(process.env.MONGOLAB_URI)
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));

db.once('open', function(){
  console.log('database connection established');
});

module.exports = db;


