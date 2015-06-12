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


// db schema urls
db.urlsSchema = new Schema({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: {type: Number, default: 0},
  timestamps: {
    createdAt: {type: Date, default: Date.now},
    modifiedAt: {type: Date, default: Date.now}
  }
});

db.urlsSchema.pre('save', function(next){
  var url = this;
  var shasum = crypto.createHash('sha1');
  shasum.update(url.url);
  url.code = shasum.digest('hex').slice(0, 5);
  next();
});

// db schema users
db.usersSchema = new Schema({
  username: String,
  password: String,
  timestamps: {
    createdAt: {type: Date, default: Date.now},
    modifiedAt: {type: Date, default: Date.now}
  }
});

db.usersSchema.pre('save', function(next){
  var user = this;
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(user.password, null, null).bind(user)
    .then(function(hash) {
      user.password = hash;
    });
  next();
});

db.usersSchema.methods.comparePassword = function(attemptedPassword, callback) {
    bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
      callback(isMatch);
    });
};

// db schema join urls-users
db.users_urlsSchema = new Schema({
  users_id: Number,
  urls_id: Number
});


