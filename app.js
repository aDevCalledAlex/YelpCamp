const rp                  = require('request-promise'),
      bodyParser          = require('body-parser'),
      mongoose            = require('mongoose')
      express             = require('express'),
      app                 = express(),
      port                = 3000,
      mongoURI            = `mongodb://localhost/yelp_camp`,
      campgroundSchema    = new mongoose.Schema({
                                name : String,
                                image : String
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

// Campground.create({name : 'Kittatiny', image : 'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1506&q=80'})
//             .then( campground => {
//               console.log(`New Campground: ${campground}`);
//             })
//             .catch( err => {
//               console.log(err);
//             });

app.use(express.static('public')); // for including this folder into the scope (stylesheet/script directory)
app.use(bodyParser.urlencoded({extended : true})); // just copypasta, needed to enable bodyParser (populate req.body)
app.set('view engine', 'ejs');

// TODO: Change Navbar item to .active when on that item's page

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/campgrounds', (req, res) => {
  Campground.find()
    .then( campgrounds => {
      res.render('campgrounds', {campgrounds});
    })
    .catch( err => {
      console.log(err);
    })
});

app.post('/campgrounds', (req, res) => {
  var name = req.body.name,
      image = req.body.image;

  if(name !== '' && image !== ''){
    var newCampground = {name, image};
    Campground.create(newCampground)
      .then( campground => {
        console.log(`New Campground: ${campground}`);
      })
      .catch( err => {
        console.log(err);
      });
  }
  
  res.redirect('/campgrounds');
});

app.get('/campgrounds/new', (req, res) => {
  res.render('new');
});
      
app.listen(port, function(){
  console.log(`Server restarted. Listening on port ${port}`);
});

