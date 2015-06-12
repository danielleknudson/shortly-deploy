var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

// db schema users
var usersSchema = mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    index: { 
      unique: true 
    } 
  },
  password: String,
});

usersSchema.pre('save', function(next){
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
    });
  next();
});

var User = mongoose.model('User', usersSchema);

User.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    if (err){
      callback(err);
    }
    callback(null, isMatch);
  });
};

module.exports = User;
