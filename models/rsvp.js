var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var rsvp = new Schema ({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  assist: {
    type: Boolean,
    required: true
  },
  kidsNumber: {
    type: Number
  },
  busChoice: {
    type: String
  },
  alergies: {
    type: String
  }
});

var RsvpModel = mongoose.model('rsvp', rsvp);

module.exports.RsvpModel = RsvpModel;
