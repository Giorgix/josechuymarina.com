var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var song = new Schema ({
  name: {
    type: String,
    require: true
  },
  artist: {
    type: String,
    require: true
  },
  title: {
    type: String,
    require: true
  },
  videoID: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  }
});

var SongModel = mongoose.model('song', song);

module.exports.SongModel = SongModel;
