const dotenv              = require('dotenv').config(),
      express             = require('express'),
      app                 = express(),
      port                = process.env.PORT || 3000,
      bodyParser          = require('body-parser'),
      expressSanitizer    = require('express-sanitizer'),
      rp                  = require('request-promise'),
      methodOverride      = require('method-override'),
      flash               = require('connect-flash'),
      passport            = require('passport'),
      LocalStrategy       = require('passport-local'),
      mongoose            = require('mongoose')
      mongoURI            = `mongodb+srv://${process.env.DB_username}:${process.env.DB_password}@${process.env.DB_hostname}` || 'mongodb://localhost/yelp_camp',
      mongoConnectOptions = {
                              useNewUrlParser : true, 
                              useFindAndModify : false, 
                              useCreateIndex : true 
                            };
      // Models
      User                = require('./models/user'),
      Campground          = require('./models/campground'),
      Comment             = require('./models/comment'),
      
      // Routes
      indexRoutes          = require('./routes/index'),
      campgroundRoutes     = require('./routes/campgrounds'),
      commentRoutes        = require('./routes/comments');

mongoose.connect(mongoURI, mongoConnectOptions)
          .catch( err => {
            console.log(err);
          });

app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(express.static(`${__dirname}/public`)); // for including this folder into the scope (stylesheet/script directory)
app.use(bodyParser.urlencoded({ extended : true })); // just copypasta, needed to enable bodyParser (populate req.body)
app.use(require('express-session')({
  secret : "I'm not sure if this is a good secret.",
  resave : false, // resave and saveUnitialized is copypasta
  saveUninitialized : false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error       = req.flash('error');
  res.locals.success     = req.flash('success');
  res.locals.info        = req.flash('info');
  next();
});
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.set('view engine', 'ejs');

// ****************************************************************
//   TODO: Change Navbar item to .active when on that item's page 
// ****************************************************************

app.listen(port, function(){
  console.log(`Server restarted. Listening on port ${port}`);
});