var express = require('express');
var router = express.Router();
var fs = require('fs');

// MODELS ===================================
var rsvps = require('.././models/rsvp.js').RsvpModel;
var advice = require('.././models/advice.js').AdviceModel;
var song = require('.././models/song.js').SongModel;

function getData(model, res) {
  model.find(function(err, data) {
    if(err) {
      res.send(err);
    } else {
      res.json(data);
    }
  });
};

//TODO create a resubale function with callback
function createItem(model, item_json, res) {
  model.create(item_json, function(err, data) {
    if(err) {
      if(err.code === 11000) {
        res.status(500);
        console.log(err);
        res.send(err);
      } else {
      console.warn(err);
      res.status(500);
      res.send(err.message);
      }
    } else {
      getData(model, res);
    }
  });

}

function deleteFile(path) {
  fs.exists(path, function(exists) {
    if(exists == true) {
      fs.unlink(path, function(err) {
        if(err) throw err;
      });
    }
  })
}

function removeItem(model, id, res) {
  model.findById(id, function (err, data){
    if(!data) {
      res.status(500);
      res.send('No item with that id');
    } else if(err){
      res.status(500);
      res.send(err);
    } else {
      data.remove(function(err) {
        if(err) {
          res.status(500);
          res.send(err);
        } else {
          if(data.image) {
            deleteFile('./public' + data.image);
          }
          getData(model, res);
        }
      });
    }
  });
};

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
    res.status(401);
    res.send('You need to login');
  }

// RSVPS ==================================
router.get('/rsvps', function(req, res) {
  getData(rsvps, res);
})

router.post('/rsvps', function(req, res) {
  createItem(rsvps, req.body, res);
  });

router.delete('/rsvps/:id', isLoggedIn, function(req, res) {
  removeItem(rsvps, req.params.id, res);
})



// ADVICE ==================================
router.get('/advice', function(req, res) {
  getData(advice, res);
})

router.post('/advice', function(req, res) {
  if(req.files.file) {
    var imageUrl = '/uploads/' + req.files.file.name;
    var adviceData = {
      name: req.body.name,
      content: req.body.content,
      image: imageUrl
    }
    console.log(adviceData);
    createItem(advice, adviceData, res);
  } else {
    createItem(advice, req.body, res);
  }
});

router.patch('/advice/:id', isLoggedIn, function(req, res) {
  console.log(req.body.aproved);
  advice.findOneAndUpdate({
    _id: req.params.id
  }, {aproved: req.body.aproved}, function(err, data){
    //console.log(data);
    if(err) {
      res.send(err);
    }
    getData(advice, res);
  });
});

/*router.patch('/advice/:id', function(res, res){

});*/

router.delete('/advice/:id', isLoggedIn, function(req, res) {
  removeItem(advice, req.params.id, res);
})


// SONG ======================================
router.get('/songs', function(req, res) {
  getData(song, res);
})

router.post('/songs', function(req, res) {
  createItem(song, req.body, res);
  });

router.delete('/song/:id', isLoggedIn, function(req, res) {
  removeItem(song, req.params.id, res);
})

module.exports = router;
