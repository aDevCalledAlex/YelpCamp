const express = require('express'),
      router  = express.Router({ mergeParams : true }),
      Campground = require('../models/campground'),
      Comment    = require('../models/comment');

// Comments: NEW - Form to create a new Comment for a Campground
router.get('/new', isLoggedIn, (req, res) => { // Needs to be below /new
  Campground.findById(req.params.id)
    .then( campground => {
      res.render('comments/new', {campground});
    })
    .catch( err => {
      console.log(err);
      res.redirect(`/campgrounds/${req.params.id}`);
    });
});

// Comments: CREATE - Create a new Comment for a Campground (POST)
router.post('/', isLoggedIn, (req, res) => {
  let campgroundID = req.params.id,
      newComment   = {
                       body : req.body.comment.body,
                       author : {
                         id : req.user._id,
                         username : req.user.username
                       }
                     }
  console.log(newComment);
  
  var createComment = async function(comment){
    return new Promise( (resolve, reject) => {
      Comment.create(comment)
        .then( newComment => {
          newComment.save();
          resolve(newComment._id);
        })
        .catch( err => { reject(err); });
    });
  }

  var findCampground = async function(campgroundID){
    return new Promise( (resolve, reject) => {
      Campground.findById(campgroundID)
        .then( campground => {
          resolve(campground);
        })
        .catch( err => { reject(err)});
    });
  }

  var configComment = async (newComment, campgroundID) => {
    return await Promise.all([
      createComment(newComment),
      findCampground(campgroundID)
    ]);
  }
  
  configComment(newComment, campgroundID)
    .then( (dataArray) => {
      let [commentID, campground] = dataArray;
      campground.comments.push(commentID);
      campground.save();
    })
    .catch( err => console.log(err));
  
  // Above may be more efficient than below 
  // --(allows comment creation/saving be async with finding campground)
  // *************************************************
  // try{
  //   let newComment = await Comment.create(req.body.comment);
  //     newComment.author.id = req.user._id;
  //     newComment.author.username = req.user.username;
  //   await newComment.save();
  //     let campground = await Campground.findById(req.params.id);
  //     campground.comments.push(newComment._id);
  //   await campground.save();
  // }
  // catch(err){
  //   console.log(err);
  // }
  // *************************************************

  res.redirect(`/campgrounds/${req.params.id}`);
});



// Middleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()) { return next(); }
  else { res.redirect('/login'); } 
}

module.exports = router;