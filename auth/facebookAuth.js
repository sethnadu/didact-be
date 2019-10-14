const passport = require('passport');
const FacebookAuth = require('passport-facebook');
const router = require('express').Router()

const secrets = require('../config/secret')

const Users = require('../users/usersModel')

passport.use(new FacebookAuth({
    clientID: secrets.facebookId,
    clientSecret: secrets.facebookSecret,
    callbackURL: `${secrets.passportUrl}/api/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'email', 'first_name', 'last_name', 'picture']
  },
  function(accessToken, refreshToken, profile, cb) {
    // console.log('Profile from FACEBOOK', profile)
    // console.log('PROFILE ID', profile._json.id)
    // console.log('PROFILE FIRST NAME', profile._json.first_name)
    // console.log('PROFILE LAST NAME', profile._json.last_name)
    // console.log('PROFILE EMAIL', profile._json.email)
    // console.log('PROFILE PHOTO', profile._json.picture)
    console.log({facebookID: profile._json.id, first_name: profile._json.first_name, last_name: profile._json.last_name, email: profile._json.email})
    Users.FBfindOrCreate({facebookID: profile._json.id, first_name: profile._json.first_name, last_name: profile._json.last_name, email: profile._json.email})
      .then(response => {
        console.log(response)
        cb(null, profile._json)
      })
      .catch(err => {
        console.log(err)
        cb(null, err)
      })

    // cb(null, profile._json)
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

router.get('/', passport.authenticate('facebook', { scope: ['email'], callbackURL: `${secrets.passportUrl}/api/auth/facebook/callback`}))

router.get('/callback',
  passport.authenticate('facebook', { failureRedirect: '/login'}),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect(url.format({
      pathname: "localhost:3000/dashboard",
      query: req.user
    }))
    // res.json(req.user)
  });

  module.exports = router;