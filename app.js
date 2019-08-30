const rp                  = require('request-promise'),
      bodyParser          = require('body-parser'),
      mongoose            = require('mongoose')
      express             = require('express'),
      app                 = express(),
      port                = 3000,
      mongoURI            = `mongodb://localhost/yelp_camp`,
      campgroundSchema    = new mongoose.Schema({
                                name : String,
                                image : String,
                                description : String
                            }),
      Campground          = mongoose.model('Campground', campgroundSchema),
      mongoConnectOptions = {
                              useNewUrlParser : true, 
                              useFindAndModify : false, 
                              useCreateIndex : true 
                            };

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
  res.render('landing');
});

// INDEX - Main page to see campgrounds
app.get('/index', (req, res) => {
  Campground.find()
    .then( campgrounds => {
      res.render('index', {campgrounds});
    })
    .catch( err => {
      console.log(err);
    })
});

// CREATE - Create a new campground (POST)
app.post('/index', (req, res) => {
  var name = req.body.name,
      image = req.body.image,
      description = req.body.description;

  if(name !== '' && image !== '' && description !== ''){
    var newCampground = {name, image, description};
    Campground.create(newCampground)
      .then( campground => {
        console.log(`New Campground: ${campground}`);
      })
      .catch( err => {
        console.log(err);
      });
  }
  
  res.redirect('index');
});

// New - Form to create a new campground
app.get('/index/new', (req, res) => {
  res.render('new');
});

// SHOW - Shows more information about a campground
app.get('/index/:id', (req, res) => { // Needs to be below /new
  Campground.findById(req.params.id)
    .then( campground => {
      res.render('show', {campground});
    })
    .catch( err => {
      console.log(err);
      res.redirect('/index');
    });
});
      
app.listen(port, function(){
  console.log(`Server restarted. Listening on port ${port}`);
});

