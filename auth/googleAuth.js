const passport = require('passport');
const router = require('express').Router()
const secrets = require('../config/secret')
const jwt = require('jsonwebtoken')

const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: secrets.googleId,
    clientSecret: secrets.googleSecret,
    callbackURL: `${secrets.passportUrl}/api/auth/google/callback`
  },
  function(accessToken, refreshToken, profile, cb) {
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
    console.log(profile)
    cb(null, profile)
  }
));

passport.serializeUser(function(user, cb) {
    cb(null, user);
  });
  
passport.deserializeUser(function(user, cb) {
    cb(null, user);
  });

router.use(passport.initialize());
router.use(passport.session());

router.get('/', passport.authenticate('google', {callbackURL: `${secrets.passportUrl}/api/auth/google/callback`}))

router.get('/callback',
  passport.authenticate('google', { failureRedirect: '/login'}),
  function(req, res) {
    // Successful authentication, redirect home.
    res.json(req.user)
  });

  module.exports = router;