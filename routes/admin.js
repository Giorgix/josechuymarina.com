var express = require('express');
var router = express.Router();
var passport = require('passport');
//require('.././config/passport')(passport);
  
  // GET ADMIN HOME ===================================
  router.get('/', isLoggedIn, function(req, res) {
    res.render('admin/dashboard');
  });
  // LOGIN ======================================
  router.get('/login', function(req, res) {
    if(req.isAuthenticated()) {
      res.redirect('/admin');
    } else {
      res.render('login', {message: req.flash('loginMessage') });
    }
  });
  router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/admin',
    failureRedirect: '/admin/login',

    failureFlash: true
  }))
  
  // SIGNUP =======================================
  router.get('/signup', function(req, res) {
    if(req.isAuthenticated()) {
      res.redirect('/admin');
    } else {
      res.render('signup', {message: req.flash('signupMessage') });
    }
  });

  router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/admin',
    failureRedirect: '/admin/signup',

    failureFlash: true
  }));
  // LOGOUT ========================
  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  })

  function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
    res.render('login', {message: 'You need to login'});
  }
module.exports = router;
