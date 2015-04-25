var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var bodyParser = require('body-parser');
var multer = require('multer');
var methodOverride = require('method-override');
var i18n = require('i18n');
var RedisStore = require('connect-redis')(session);
var mongoose = require('mongoose');
var flash = require('connect-flash');

var configDB = require('./config/db.js');
var dbURL;
var env = process.env.NODE_ENV || 'development';
if(env == 'development') {
  dbURL = configDB.urlDev;
} else if(env == 'production') {
  dbURL = configDB.url;
}

// DB ===================================
mongoose.connect(dbURL);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  console.log('Connected to DB: ' + dbURL);
})

i18n.configure({
  locales: ['es'],
  updateFiles: false,
  defaultLocale: 'es',
  cookie: 'locale',
  directory: __dirname + '/locales'
});

var app = express();

var routes = require('./routes/index');
var apiRoutes = require('./routes/api');
var adminRoutes = require('./routes/admin');

app.use(multer({dest: './public/uploads/'}));

require('./config/passport')(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(i18n.init);

app.use(session({ 
  store: new RedisStore,
  secret: '0GISGOBWxz9iNcpXLgsQ@#$',
  cookie: {
    maxAge: 100*60*60
  },
  rolling: true,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/', routes);
app.use('/admin', adminRoutes);
app.use('/api', apiRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
