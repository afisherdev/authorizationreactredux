const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')
const User = mongoose.model('users');
const jwt = require('jwt-simple')
const keys = require('../config/keys')

function tokenForUser(user){
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user._id, iat: timestamp }, keys.jwtSecret)
}

exports.signin = function(req, res, next) {
  // User has already had their email and password auth'd
  // we just need to supply them with a token.
  res.send({ token: tokenForUser(req.user)})
}

exports.signup = function(req, res, next) {
  console.log(req.body)
  const email = req.body.email;
  const password = req.body.email;

  if (!email || !password) {
    return res.status(422).send({ error: "You must provide an email and a password."})
  }
// See if a user with the given email exists
  User.findOne({ email: email }, function(err, existingUser) {
    if(err) { return next(err); }
// If a user with email does exist, return an console.error

    if(existingUser) {
      return res.status(422).send({ error: 'Email is in use'});
    }
    // if a user with email does NOT exist, create and save user record
    const user = new User({
      email: email,
      password: password,
    });
    user.save(function(err){
      if(err) { return next(err); }
    });
    console.log("createIds has been triggered")
    console.log("User Email:", user.email)
    console.log("User ID:", user._id)

    bcrypt.genSalt(15, function(err, salt){
      if (err) {
        return next(err);
      }
      bcrypt.hash(user._id, salt, null, function(err, hash) {
        if (err) {
          return next(err);
        }
        user.verificationId = hash.replace(/[^A-Z0-9]/ig, "");;
        console.log("verificationId:", user.verificationId)

        })
      })
    bcrypt.genSalt(13, function(err, salt2){
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.verificationId, salt2, null, function(err, hash){
        if (err) {
          return next(err);
        }
        user.referralId = hash.replace(/[^A-Z0-9]/ig, "");
        console.log("referralID:", user.referralId)
    })

  })

    user.save(function(err){
      if(err) { return next(err); }
    });

  res.json({ token: tokenForUser(user) });
});
};

// Respond to request indicating the user was created
