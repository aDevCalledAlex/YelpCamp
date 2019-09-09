const mongoose      = require('mongoose'),

      commentSchema = new mongoose.Schema({
                        body : String,
                        author : {
                          id : {
                            type : mongoose.Schema.Types.ObjectID,
                            ref : "User"
                          },
                          username : String
                        }
                      });

module.exports      = mongoose.model('Comment', commentSchema); // Allow Comment to be required