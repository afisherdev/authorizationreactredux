const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');
const LocalStrategy = require('passport-local').Strategy;
const User = mongoose.model('users');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

//==============Strategy Options==============
const localOptions = {
  usernameField: 'email'
};
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: keys.jwtSecret
};
const googleOptions = {
  clientID: keys.googleClientID,
  clientSecret: keys.googleClientSecret,
  callbackURL: '/auth/google/callback',
  proxy: true
}

//=================JWT Strategy===============
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  User.findById(payload.sub, function(err, user) {
    if (err) {
      return done(err, false);
    }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});
// ===============Local Strategy==============
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
    console.log("Starting to find User")
    User.findOne({ email: email }, function(err, user) {
      if (err) {
        console.log("error finding user")
        return done(err);
      }
      if (!user) {
        console.log("Couldn't find user")
        return done(null, false, {
          message: 'Either your email or your password were incorrect.'
        })
      user.comparePassword(password, function(err, isMatch) {
        console.log("started compare password function")
        if (err) {
          console.log('there was an error comparing the password')
          return done(err);
        }
        if (!isMatch) {
          console.log('the password didnt match')
          return done(null, false, {
            message: 'Either your email or your password were incorrect.'
          });
          console.log('login successful')
          return done(null, user);
        }
      });
    };
  });
});
  //================= Google Strategy ================
const googleLogin = new GoogleStrategy(googleOptions, async (accessToken, refreshToken, profile, done) => {
    const existingUser = await User.findOne({ googleId: profile.id });

    if (existingUser) {
      return done(null, existingUser);
    }

    const user = await new User({
      googleId: profile.id,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      email: profile.emails[0].value,
      gender: profile.gender
    }).save();
    done(null, user);
  }
);


// ================Use Strategies ================
passport.use(jwtLogin);
passport.use(localLogin);
passport.use(googleLogin);
