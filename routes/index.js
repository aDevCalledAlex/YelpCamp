const express    = require('express'),
      router     = express.Router(),
      passport   = require('passport'),
      User       = require('../models/user'),
      middleware = require('../middleware');

// Root Route
router.get('/', (req, res) => {
  res.render('index/landing');
});

// Sign Up Form
router.get('/register', middleware.isNotLoggedIn, (req, res) => {
  res.render('index/register');
});

// Sign Up Logic
router.post('/register', middleware.isNotLoggedIn, (req, res) => {
  let newUser = new User({username : req.body.username});
  User.register(newUser, req.body.password, (err, user) => {
    if(err){
      console.log(err);
      req.flash('error', err.message);
      res.redirect('/register')
    }
    else {
      passport.authenticate('local')(req, res, () => {
        req.flash('success', `Welcome to YelpCamp, ${user.username}!`);
        res.redirect('/campgrounds');
      });
    }
  });
});

// Login Form
router.get('/login', middleware.isNotLoggedIn, (req, res) => {
  res.render('index/login');
});

// Login Logic
router.post('/login', middleware.isNotLoggedIn, 
  passport.authenticate('local', {
      successRedirect : '/campgrounds',
      failureRedirect : '/login',
      // successFlash : `Welcome back, ${req.user.username}!`,
      failureFlash : true
    }
  )
);

// Logout Logic
router.get('/logout', middleware.isLoggedIn, (req, res) => {
  req.flash('info', `Signed out as ${req.user.username}.`);
  req.logout();
  res.redirect('/campgrounds');
});

module.exports = router;