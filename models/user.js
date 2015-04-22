var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var Schema = mongoose.Schema;

var userSchema = new Schema ({
  local: {
    email: { 
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
    }
  },
  facebook: {
    id : String,
    token: String,
    email: String,
    name: String
  },
  twitter: {
    id : String,
    token: String,
    username: String,
    displayName: String
  },
  google: {
    id : String,
    token: String,
    email: String,
    name: String
  }

});

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
