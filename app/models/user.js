var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

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

var User = db.model('User', db.usersSchema);

module.exports = User;
