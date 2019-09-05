const mongoose      = require('mongoose'),

      commentSchema = new mongoose.Schema({
                        author : String,
                        body : String
                      });

module.exports      = mongoose.model('Comment', commentSchema); // Allow Comment to be required