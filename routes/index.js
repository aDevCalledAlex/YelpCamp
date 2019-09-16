const express    = require('express'),
      router     = express.Router(),
      passport   = require('passport'),
      User       = require('../models/user'),
      middleware = require('../middleware');

// Root Route
router.get('/', (req, res) => {
  res.render('landing');
});

// Sign Up Form
router.get('/register', middleware.isNotLoggedIn, (req, res) => {
  res.render('users/register');
});

// Sign Up Logic
router.post('/register', middleware.isNotLoggedIn, (req, res) => {
  let newUser = new User({username : req.body.username});
  User.register(newUser, req.body.password)
    .then( async () => {
      await passport.authenticate('local');
      res.redirect('/campgrounds')
    })
    .catch( err => {
      console.log(err);
      res.redirect('/register');
    });
});

// Login Form
router.get('/login', middleware.isNotLoggedIn, (req, res) => {
  res.render('users/login');
});

// Login Logic
router.post('/login', middleware.isNotLoggedIn, 
  passport.authenticate('local', {
      successRedirect : '/campgrounds',
      failureRedirect : '/login'
    }
  )
);

// Logout Logic
router.get('/logout', middleware.isLoggedIn, (req, res) => {
  req.logout();
  res.redirect('/campgrounds');
});

module.exports = router;