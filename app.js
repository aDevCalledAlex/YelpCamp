const express             = require('express'),
      app                 = express(),
      port                = 3000,
      bodyParser          = require('body-parser'),
      rp                  = require('request-promise'),
      mongoose            = require('mongoose')
      mongoURI            = `mongodb://localhost/yelp_camp`,
      mongoConnectOptions = {
                              useNewUrlParser : true, 
                              useFindAndModify : false, 
                              useCreateIndex : true 
                            };
      Campground          = require('./models/campground'),
      Comment             = require('./models/comment'),

mongoose.connect(mongoURI, mongoConnectOptions)
          .catch( err => {
            console.log(err);
          });

app.use(express.static('public')); // for including this folder into the scope (stylesheet/script directory)
app.use(bodyParser.urlencoded({extended : true})); // just copypasta, needed to enable bodyParser (populate req.body)

app.set('view engine', 'ejs');

// ****************************************************************
//   TODO: Change Navbar item to .active when on that item's page 
// ****************************************************************

app.get('/', (req, res) => {
  res.render('campgrounds/landing');
});

// campgrounds - Main page to see campgrounds
app.get('/campgrounds', (req, res) => {
  Campground.find()
    .then( campgrounds => {
      res.render('campgrounds/index', {campgrounds});
    })
    .catch( err => {
      console.log(err);
    })
});

// CREATE - Create a new campground (POST)
app.post('/campgrounds', (req, res) => {
  var name = req.body.name,
      image = req.body.image,
      description = req.body.description;

  var newCampground = {name, image, description};
  Campground.create(newCampground)
    .then( campground => {
      console.log(`New Campground: ${campground}`);
    })
    .catch( err => {
      console.log(err);
    });
  
  res.redirect('campgrounds');
});

// NEW - Form to create a new campground
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

// SHOW - Shows more information about a campground
app.get('/campgrounds/:id', (req, res) => { // Needs to be below /new
  Campground.findById(req.params.id).populate('comments')
    .then( campground => {
      res.render('campgrounds/show', {campground});
    })
    .catch( err => {
      console.log(err);
      res.redirect('/campgrounds');
    });
});

// Comment Routes!
// ***************
// NEW - Form to create a new comment for a campground
app.get('/campgrounds/:id/comments/new', (req, res) => { // Needs to be below /new
  Campground.findById(req.params.id)
    .then( campground => {
      res.render('comments/new', {campground});
    })
    .catch( err => {
      console.log(err);
      res.redirect(`/campgrounds/${req.params.id}`);
    });
});

// CREATE - Create a new comment for a campground (POST)
app.post('/campgrounds/:id/comments', async (req, res) => {
  try{
    let comment = await Comment.create(req.body.comment);
    let campground = await Campground.findById(req.params.id);
    campground.comments.push(comment);
    campground.save();
  }
  catch(err){
    console.log(err);
  }

  res.redirect('/campgrounds/:id');
});
      
app.listen(port, function(){
  console.log(`Server restarted. Listening on port ${port}`);
});

