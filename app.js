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
      passport            = require('passport'),
      LocalStrategy       = require('passport-local'),
      User                = require('./models/user')
      Campground          = require('./models/campground'),
      Comment             = require('./models/comment'),

mongoose.connect(mongoURI, mongoConnectOptions)
          .catch( err => {
            console.log(err);
          });

app.use(express.static(`${__dirname}/public`)); // for including this folder into the scope (stylesheet/script directory)
app.use(bodyParser.urlencoded({extended : true})); // just copypasta, needed to enable bodyParser (populate req.body)
app.use(require('express-session')({
  secret : "I'm not sure if this is a good secret.",
  resave : false, // resave and saveUnitialized is copypasta
  saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.set('view engine', 'ejs');

// ****************************************************************
//   TODO: Change Navbar item to .active when on that item's page 
// ****************************************************************

app.get('/', (req, res) => {
  res.render('landing');
});

// Campground Routes!
// ******************
// INDEX - Main page to see campgrounds
app.get('/campgrounds', (req, res) => {
  Campground.find()
    .then( campgrounds => {
      res.render('campgrounds/index', {campgrounds});
    })
    .catch( err => {
      console.log(err);
    })
});

// NEW - Form to create a new campground
app.get('/campgrounds/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

// CREATE - Create a new campground (POST)
app.post('/campgrounds', isLoggedIn, (req, res) => {
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
// NEW - Form to create a new Comment for a Campground
app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => { // Needs to be below /new
  Campground.findById(req.params.id)
    .then( campground => {
      res.render('comments/new', {campground});
    })
    .catch( err => {
      console.log(err);
      res.redirect(`/campgrounds/${req.params.id}`);
    });
});

// CREATE - Create a new Comment for a Campground (POST)
app.post('/campgrounds/:id/comments', isLoggedIn, async (req, res) => {
  try{
    let comment = await Comment.create(req.body.comment);
    let campground = await Campground.findById(req.params.id);
    campground.comments.push(comment);
    campground.save();
  }
  catch(err){
    console.log(err);
  }

  res.redirect(`/campgrounds/${req.params.id}`);
});

// Auth Routes!
// ************
// NEW - Form to create a new User
app.get('/register', (req, res) => {
  res.render('users/register');
});

// CREATE - Create a new User (POST)
app.post('/register', (req, res) => {
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

app.get('/login', (req, res) => {
  res.render('users/login');
});

app.post('/login', 
  passport.authenticate('local', {
      successRedirect : '/campgrounds',
      failureRedirect : '/login'
    }
  )
);
      
app.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  else{
    res.redirect('/login');
  } 
}

app.listen(port, function(){
  console.log(`Server restarted. Listening on port ${port}`);
});

