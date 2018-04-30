const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
  googleId: {
    type: String,
    unique: false,
    required: false,
    trim: true
  },
  firstName: {
    type: String,
    required: false,
    trim: true
  },
  lastName: {
    type: String,
    required: false,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true
  },
  gender: {
    type: String,
    required: false,
    default: ''
  },
  referralId: {
    type: String,
    required: false,
    trim: true,
    default: ''
  },
  purchasedCoins: {
    type: Number,
    default: 0,
    required: false
  },
  bonusCoins: {
    type: Number,
    default: 0,
    required: false
  },
  wasReferred: {
    type: Boolean,
    default: false
  },
  referredBy: {
    type: String,
    required: false,
    default: ''
  },
  txCount: {
    type: Number,
    default: 0
  },
  erc20WalletAddress: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    default: ''
  },
  accountVerified: {
    type: Boolean,
    default: false
  },
  verificationId: {
    type: String,
    required: false
  }
});
userSchema.pre('save', function(next) {
  const user = this;

  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  console.log("ComparePasswordWorking")
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
    if (err) { return callback(err); }
    callback(null, isMatch);
  })
}


const ModelClass = mongoose.model('users', userSchema);

module.exports = ModelClass
