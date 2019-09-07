const mongoose              = require('mongoose'),
      passportLocalMongoose = require('passport-local-mongoose'),

      userSchema            = new mongoose.Schema({
                               username : String,
                               password : String,
                               campgrounds : [{
                                 type : mongoose.Schema.Types.ObjectId,
                                 ref : 'Campground'
                               }],
                               comments : [{
                                 type : mongoose.Schema.Types.ObjectId,
                                 ref : 'Comment'
                               }]
                             });

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema); // Allow Campground to be required