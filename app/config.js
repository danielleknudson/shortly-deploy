var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Use production URI if in production environment, 
// else use localhost
var mongoURI = process.env.MONGOLAB_URI || 'mongodb://127.0.0.1/bittydb'
mongoose.connect(mongoURI);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));

db.once('open', function(){
  console.log('database connection established');
});

module.exports = db;


