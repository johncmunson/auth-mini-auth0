var express = require('express');
var session = require('express-session');
var passport = require('passport');
var Auth0Strategy = require('passport-auth0');

var app = express();

var config = require('./authConfig.js')

app.use(session({secret: 'asdfadsfasdf'}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new Auth0Strategy(
    {
        domain: config.domain,
        clientID: config.clientID,
        clientSecret: config.secret,
        callbackURL: 'http://localhost:3000/auth/callback'
    },
    function(accessToken, refreshToken, extraParams, profile, done) {
        return done(null, profile);
    }
));

app.get('/auth', passport.authenticate('auth0'));

app.get('/auth/callback', passport.authenticate('auth0', {
  successRedirect: '/auth/me',
  failureRedirect: '/auth/me'
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.get('/auth/me', function(req,res,next){
  if (!req.user) {
    return res.status(404).send('user not found');
  }
  return res.status(200).send(req.user);
})

var port = config.port;
app.listen(port, function(){
  console.log(`listening on port ${port}`);
})
