const express    = require('express'),
      router     = express.Router(),
      Campground = require('../models/campground');

// Campground: INDEX - Main page to see campgrounds
router.get('/', (req, res) => {
  Campground.find()
    .then( campgrounds => {
      res.render('campgrounds/index', {campgrounds});
    })
    .catch( err => {
      console.log(err);
    })
});

// Campground: NEW - Form to create a new campground
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

// Campground: CREATE - Create a new campground (POST)
router.post('/', isLoggedIn, (req, res) => {
  let name = req.body.name,
      image = req.body.image,
      description = req.body.description;

  let newCampground = {name, image, description};
  Campground.create(newCampground)
    .then( campground => {
      console.log(`New Campground: ${campground}`);
    })
    .catch( err => {
      console.log(err);
    });
  
  res.redirect('campgrounds');
});

// Campground: SHOW - Shows more information about a campground
router.get('/:id', (req, res) => { // Needs to be below /new
  Campground.findById(req.params.id).populate('comments')
    .then( campground => {
      res.render('campgrounds/show', {campground});
    })
    .catch( err => {
      console.log(err);
      res.redirect('/campgrounds');
    });
});

// Middleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()) { return next(); }
  else { res.redirect('/login'); } 
}

module.exports = router;