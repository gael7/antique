//http://devsmash.com/blog/password-authentication-with-mongoose-and-bcrypt

var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs'),
    Schema =mongoose.Schema;

var UserSchema = new Schema({
  local:{
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    isAdm: {  type: Boolean, default: false}
  }
});

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', UserSchema);
