const mongoose         = require('mongoose'),

      campgroundSchema = new mongoose.Schema(
                          {
                            name : String,
                            image : String,
                            description : String,
                            price : String,
                            websiteURL : String,
                            author : {
                              id : {
                                type : mongoose.Schema.Types.ObjectId,
                                ref : "User"
                              },
                              username : String
                            },
                            comments : [{
                              type : mongoose.Schema.Types.ObjectId,
                              ref : "Comment"
                            }]
                           }
                         );

module.exports = mongoose.model('Campground', campgroundSchema); // Allow Campground to be required