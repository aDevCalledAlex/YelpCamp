const Campground = require('../models/campground'),
      Comment    = require('../models/comment'),
      middleware = {};

middleware.isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) { return next(); }
  else {
    req.flash('error', 'You need to be logged in to do that.'); 
    res.redirect('/login'); 
  } 
}

middleware.isNotLoggedIn = (req, res, next) => {
  if(!req.isAuthenticated()) { return next(); }
}

middleware.ownsCampground = (req, res, next) => {
  if(req.isAuthenticated()){
    let campgroundID  = req.params.id,
        currentUserID = req.user._id;

    Campground.findById(campgroundID)
      .then( campground => {
        if(campground.author.id.equals(currentUserID)){
          next();
        }
        else { res.redirect('back')}
      })
      .catch( err => {
        console.log(err);
        res.redirect('back'); 
      });
  }
  else {
    req.flash('error', 'You need to be logged in to do that.'); 
    res.redirect('/login'); 
  }
}

middleware.ownsComment = (req, res, next) => {
  if(req.isAuthenticated()){
    let commentID     = req.params.comment_id,
        currentUserID = req.user._id;

    Comment.findById(commentID)
      .then( comment => {
        if(comment.author.id.equals(currentUserID)){
          next();
        }
        else { res.redirect('back')}
      })
      .catch( err => {
        console.log(err);
        res.redirect('back'); 
      });
  }
  else {
    req.flash('error', 'You need to be logged in to do that.'); 
    res.redirect('/login'); 
  }
}

module.exports = middleware;