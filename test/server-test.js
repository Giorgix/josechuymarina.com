var dbURI = 'mongodb://localhost:27017/wedding-test'
  , should = require('chai').should()
  , mongoose = require('mongoose')
  , supertest = require('supertest')
  , api = supertest('http://localhost:3000/api')
  , Dummy = require('.././models/rsvp.js').RsvpModel
  , clearDB = require('mocha-mongoose')(dbURI, {noClear: true})
  ;

describe("Basic dummy model db operations", function() {
  before(function(done) {
    if(mongoose.connection.db) return done();
    mongoose.connect(dbURI, done)
  });

  beforeEach(function(done) {
    clearDB(done);
  });
  beforeEach(function(done) {
    Dummy.create({firstName: 'Pepe'
                , lastName: 'Perez'
                , email: 'email@email.com'
                , sleepPref: 'Madrid'
                },done);
                  
  });

  it("can be listed", function(done){
    Dummy.find({}, function(err, docs) {
      if(err) return done(err);
      docs.length.should.equal(1);
      done();
    });
  });
  it("can clear DB on demand", function(done) {
    Dummy.count(function(err, count) {
      if(err) return done(err);
      count.should.equal(1);
    })

    clearDB(function(err) {
      if(err) return done(err);

      Dummy.find({}, function(err, docs) {
        if (err) return done(err);

        docs.length.should.equal(0);
        done();
      });
    });
  });
});

describe("API request", function() {
  var itemId;
  beforeEach(function(done) {
    clearDB(done);
  });
  
  beforeEach(function(done) {
    Dummy.create({firstName: 'Pepe'
                , lastName: 'Perez'
                , email: 'email@email.com'
                , sleepPref: 'Madrid'
                },function(err, dummy) {
                  itemId = dummy._id;
                  done();
                });
  });

  it('POST: should create a new element', function(done) {
    api.post('/rsvps')
      .send({firstName: 'Paco'
           , lastName: 'Martinez'
           , email: 'email2@email2.com'
           , sleepPref: 'Brihuega'})
      .expect(200)
      .end(function(err, res) {
        if(err) return done(err);
        res.body.length.should.equal(2);
        done();
      });
  });
  it('GET: should return elements in JSON', function(done) {
    api.get('/rsvps')
       .expect(200)
       .expect('Content-Type', /json/)
       .end(function(err, res) {
         if(err) return done(err);
         res.body.length.should.equal(1);
         done();
       });
  });
  it('DELETE: should delete the given item', function(done) {
    api.delete('/rsvps/' + itemId)
       .expect(200)
       .end(function(err, res) {
         if(err) return done(err);
         res.body.length.should.equal(0);
         done();
       });
  });
})
