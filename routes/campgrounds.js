const express    = require('express'),
      router     = express.Router(),
      Campground = require('../models/campground'),
      middleware = require('../middleware');

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
router.get('/new', middleware.isLoggedIn, (req, res) => {
  console.log('\n\n\n');
  res.render('campgrounds/new');
});

// Campground: CREATE - Create a new campground (POST)
router.post('/', middleware.isLoggedIn, (req, res) => {
  let author        = {
                        id : req.user._id,
                        username : req.user.username
                      },
      newCampground = {...req.body.campground, author};
  newCampground.description = req.sanitize(newCampground.description);

  Campground.create(newCampground)
    .then( campground => {
      console.log(`New Campground: ${campground}`);
    })
    .catch( err => { console.log(err); });
  
  res.redirect('/campgrounds');
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

// Campground: EDIT - Form to edit a campground
router.get('/:id/edit', middleware.ownsCampground, (req, res) => {
  Campground.findById(req.params.id)
    .then( campground => {
      res.render('campgrounds/edit', {campground});
    })
    .catch( err => {
      console.log(err);
      res.redirect('/campgrounds');
    });
});

// Campground: UPDATE - Update a campground (PUT)
router.put('/:id', middleware.ownsCampground, (req, res) => {
  let updatedCampground         = req.body.campground,
      campgroundID              = req.params.id;
  updatedCampground.description = req.sanitize(updatedCampground.description);

  Campground.findByIdAndUpdate(campgroundID, updatedCampground)
    .then( () => {
      console.log(`Updated Campground : ${JSON.stringify(updatedCampground, null, 2)}`);
      res.redirect(`/campgrounds/${campgroundID}`);
    })
    .catch( err => { 
      console.log(err); 
      res.redirect('/campgrounds');
    });
});

// Campground: DESTROY - Remove a campground (DELETE)
router.delete('/:id', middleware.ownsCampground, (req, res) => {
  let campgroundID = req.params.id;

  Campground.findByIdAndRemove(campgroundID).populate('comments')
    .then( deletedCampground => {
      for(comment of comments){
        Comment.findByIdAndRemove(comment._id);
      }
      console.log(`Removed Campground : ${deletedCampground}`);
    })
    .catch( err => { console.log(err); } );

    res.redirect('/campgrounds');
})

module.exports = router;