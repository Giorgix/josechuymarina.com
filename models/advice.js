var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var commentSchema = new Schema({
  
  name: {
    type: String,
  },
  
  text: {
    type: String,
  }

});

var advice = new Schema ({
  
  name: {
    type: String,
    require: true
  },
  
  content: {
    type: String,
    require: true
  },
  
  image: {
    type: String
  },
  
  created: {
    type: Date,
    default: Date.now
  },

  //comments: [commentSchema],

  aproved: {
    type: Boolean,
    required: true,
    default: false
  }
});

var AdviceModel = mongoose.model('advice', advice);

module.exports.AdviceModel = AdviceModel;
