//http://devsmash.com/blog/password-authentication-with-mongoose-and-bcrypt

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcryptjs'),
    SALT_WORK_FACTOR = 10,
    jsonwebtoken = require('jsonwebtoken');

var UserSchema = new Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
});

UserSchema.pre('save', function (next) {
    var user = this;
    console.log('saving user!');
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            // override the clear-text password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function (candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return callback(err);
        return callback(null, isMatch);
    });
};

UserSchema.statics.getAuthenticated = function (user, callback) {
    console.log('getAuthenticated', user);
    this.findOne({username: user.username}, function (err, doc) {
        if (err) {
            console.log(err);
            return callback(err);
        }

        // make sure the user exists
        else if (!doc) {
            console.log('No user found,');
            return callback(new Error('Invalid username or password.', 401), null);
        }
        else {
            // test for a matching password
            doc.comparePassword(user.password, function (err, isMatch) {
                if (err) {
                    console.log(err);
                    return callback(err);
                }

                // check if the password was a match
                if (isMatch) {

                    // return the jwt
                    var token = jsonwebtoken.sign(doc, 'supersecret', {
                        expiresIn: 60*60*24 // expires in 24 hours
                    });
                    return callback(null, token, doc);
                }
                else {
                    return callback(new Error('Invalid username or password.'), null);

                }
            });
        }
    });
};

module.exports = mongoose.model('User', UserSchema);
