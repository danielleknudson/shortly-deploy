var db = require('../config');
var crypto = require('crypto');

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

var Link = db.model('Link', db.urlsSchema);

module.exports = Link;
