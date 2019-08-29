const rp = require('request-promise'),
      express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      port = 3000;
      campgrounds = [
        {name : 'Kittatiny', image : 'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1506&q=80'},
        {name : 'Blue Hill', image : 'https://images.unsplash.com/photo-1470246973918-29a93221c455?ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80'},
        {name : 'Kittatiny', image : 'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1506&q=80'},
        {name : 'Blue Hill', image : 'https://images.unsplash.com/photo-1470246973918-29a93221c455?ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80'},
        {name : 'Kittatiny', image : 'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1506&q=80'},
        {name : 'Blue Hill', image : 'https://images.unsplash.com/photo-1470246973918-29a93221c455?ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80'},
        {name : 'Mountain Range', image : 'https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80'},
        {name : 'Camp Park', image : 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80'},
        {name : 'Tent City', image : 'https://images.unsplash.com/photo-1537905569824-f89f14cceb68?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=647&q=80'},
        {name : 'Fauna or Flora', image : 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80'},
        {name : 'Kittatiny', image : 'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1506&q=80'},
        {name : 'Blue Hill', image : 'https://images.unsplash.com/photo-1470246973918-29a93221c455?ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80'},
        {name : 'Mountain Range', image : 'https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80'},
        {name : 'Fauna or Flora', image : 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80'},
        {name : 'Kittatiny', image : 'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1506&q=80'},
        {name : 'Blue Hill', image : 'https://images.unsplash.com/photo-1470246973918-29a93221c455?ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80'},
        {name : 'Mountain Range', image : 'https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80'},
        {name : 'Camp Park', image : 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80'},
        {name : 'Tent City', image : 'https://images.unsplash.com/photo-1537905569824-f89f14cceb68?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=647&q=80'},
        {name : 'Fauna or Flora', image : 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80'},
        {name : 'Kittatiny', image : 'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1506&q=80'},
        {name : 'Blue Hill', image : 'https://images.unsplash.com/photo-1470246973918-29a93221c455?ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80'},
        {name : 'Mountain Range', image : 'https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80'},
        {name : 'Blue Hill', image : 'https://images.unsplash.com/photo-1470246973918-29a93221c455?ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80'},
        {name : 'Mountain Range', image : 'https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80'},
        {name : 'Camp Park', image : 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80'},
        {name : 'Tent City', image : 'https://images.unsplash.com/photo-1537905569824-f89f14cceb68?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=647&q=80'},
        {name : 'Fauna or Flora', image : 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80'},
        {name : 'Mountain Range', image : 'https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80'},
        {name : 'Camp Park', image : 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80'},
        {name : 'Tent City', image : 'https://images.unsplash.com/photo-1537905569824-f89f14cceb68?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=647&q=80'},
        {name : 'Fauna or Flora', image : 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80'},
        {name : 'Kittatiny', image : 'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1506&q=80'},
        {name : 'Blue Hill', image : 'https://images.unsplash.com/photo-1470246973918-29a93221c455?ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80'},
        {name : 'Mountain Range', image : 'https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80'},
        {name : 'Camp Park', image : 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80'},
        {name : 'Tent City', image : 'https://images.unsplash.com/photo-1537905569824-f89f14cceb68?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=647&q=80'},
        {name : 'Fauna or Flora', image : 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80'},
      ];

app.use(express.static('public')); // for including this folder into the scope (stylesheet/script directory)
app.use(bodyParser.urlencoded({extended : true})); // just copypasta, needed to enable bodyParser (populate req.body)
app.set('view engine', 'ejs');

// TODO: Change Navbar item to .active when on that item's page

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/campgrounds', (req, res) => {
  res.render('campgrounds', {campgrounds : campgrounds});
});

app.post('/campgrounds', (req, res) => {
  var name = req.body.name,
      image = req.body.image;

  if(name !== '' && image !== ''){
    var newCampground = {name : name, image : image};
    campgrounds.push(newCampground);
  }
  
  res.redirect('/campgrounds');
});

app.get('/campgrounds/new', (req, res) => {
  res.render('new');
});

// app.get('/results', function(req, res){
  //   var query = req.query.s,
  //       url = `http://www.omdbapi.com/?s=${query}&apikey=thewdb`;
  //   rp(url)
  //     .then((body) => {
    //       const parsedData = JSON.parse(body);
    //       res.render('results', {results : parsedData.Search,
    //                              query : query});
    //     })
    //     .catch((error) => {
      //       console.log('Error!', error);
      //     });
      // })
      
app.listen(port, function(){
  console.log(`Server restarted. Listening on port ${port}`);
});

