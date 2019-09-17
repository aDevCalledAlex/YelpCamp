const express    = require('express'),
      router     = express.Router({ mergeParams : true }),
      Campground = require('../models/campground'),
      Comment    = require('../models/comment'),
      middleware = require('../middleware');

// Comment: NEW - Form to create a new Comment for a Campground
router.get('/new', middleware.isLoggedIn, (req, res) => { // Needs to be below /new
  Campground.findById(req.params.id)
    .then( campground => {
      res.render('comments/new', {campground});
    })
    .catch( err => {
      console.log(err);
      res.redirect(`/campgrounds/${req.params.id}`);
    });
});

// Comment: CREATE - Create a new Comment for a Campground (POST)
router.post('/', middleware.isLoggedIn, (req, res) => {
  let campgroundID = req.params.id,
      newComment   = {
                       body : req.sanitize(req.body.comment.body),
                       author : {
                         id : req.user._id,
                         username : req.user.username
                       }
                     }

  configComment(newComment, campgroundID)
    .then( dataArray => {
      let [commentID, campground] = dataArray;
      campground.comments.push(commentID);
      campground.save();
      res.redirect(`/campgrounds/${req.params.id}`);
    })
    .catch( err => {
      console.log(err);
      res.redirect('back'); 
    });
  
  /*********************************************************
   *   Asynchronous database interfacing functions below   *
   *********************************************************/ 
    
  async function configComment(newComment, campgroundID){
    return await Promise.all([
      createComment(newComment),
      findCampground(campgroundID)
    ]);
  };

  async function createComment(comment){
    return new Promise( (resolve, reject) => {
      Comment.create(comment)
        .then( newComment => {
          resolve(newComment._id);
        })
        .catch( err => { reject(err); } );
    });
  };

  async function findCampground(campgroundID){
    return new Promise( (resolve, reject) => {
      Campground.findById(campgroundID)
        .then( campground => {
          resolve(campground);
        })
        .catch( err => { reject(err) } );
    });
  };
  
  /************************************************************************/
  /*  Above may be more efficient than below                              */
  /*  --(allows comment creation/saving be async with finding campground) */
  /************************************************************************/
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
  /********************************************************************/
});


// Comment: EDIT - Form to edit a comment
router.get('/:comment_id/edit', middleware.ownsComment, (req, res) => {
  let campgroundID = req.params.id,
      commentID    = req.params.comment_id;
  
  findCampgroundAndComment(campgroundID, commentID)
    .then( dataArray => {
      let [campground, comment] = dataArray;
      res.render('comments/edit', {campground, comment});
    })
    .catch( err => {
      console.log(err);
      res.redirect('back');
    });

  /*********************************************************
   *   Asynchronous database interfacing functions below   *
   *********************************************************/ 

  async function findCampgroundAndComment(campgroundID, commentID){
    return await Promise.all([
      findCampground(campgroundID),
      findComment(commentID)
    ]);
  };
    
  async function findCampground(campgroundID){
    return new Promise( (resolve, reject) => {
      Campground.findById(campgroundID)
        .then( campground => {
          resolve(campground);
        })
        .catch( err => { reject(err) } );
    });
  };

  async function findComment(commentID){
    return new Promise( (resolve, reject) => {
      Comment.findById(commentID)
        .then( comment => {
          resolve(comment);
        })
        .catch( err => { reject(err); } );
    });
  };
});

// Comment: UPDATE - Update a comment (PUT)
router.put('/:comment_id', middleware.ownsComment, (req, res) => {
  let updatedComment  = req.body.comment,
      commentID       = req.params.comment_id,
      campgroundID    = req.params.id;
  updatedComment.body = req.sanitize(updatedComment.body);

  Comment.findByIdAndUpdate(commentID, updatedComment)
    .then( () => {
      console.log(`Campground (${campgroundID}) : 
        Updated Comment (${commentID}) : ${updatedComment}`);
      res.redirect(`/campgrounds/${campgroundID}`);
    })
    .catch( err => {
      console.log(err);
      res.redirect('back');
    });
});

// Campground: DESTROY - Remove a campground (DELETE)
router.delete('/:comment_id', middleware.ownsComment, (req, res) => {
  let commentID    = req.params.comment_id,
      campgroundID = req.params.id;
  
  Comment.findByIdAndRemove(commentID)
    .then( comment => {
      console.log(`Campground (${campgroundID}) : 
        Removed Comment (${commentID}) : ${comment.body}`);
      res.redirect(`/campgrounds/${campgroundID}`);
    })
    .catch( err => {
      console.log(err);
      res.redirect('back');
    });
});

module.exports = router;