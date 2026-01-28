require('dotenv').config(); // Load environment variables early
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');

var indexRouter = require('./routes/index');
var carsRouter = require('./routes/cars');
var adminRouter = require('./routes/admin');
var authRouter = require('./routes/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Attach user from cookie to request + locals for simple role-based access
app.use(function(req, res, next) {
  const rawUser = req.cookies.user;
  if (rawUser) {
    try {
      req.user = JSON.parse(rawUser);
    } catch (err) {
      req.user = null;
    }
  } else {
    req.user = null;
  }
  res.locals.currentUser = req.user;
  const role = req.user && req.user.Role;
  res.locals.isAdmin = role === 'admin';
  res.locals.isDealer = role === 'dealer';
  res.locals.isBuyer = role === 'buyer';
  next();
});

app.use('/', indexRouter);
app.use('/cars', carsRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// Allow running directly with `node app.js`
if (require.main === module) {
  var port = normalizePort(process.env.PORT || '3000');
  app.set('port', port);

  var server = http.createServer(app);
  server.listen(port, function() {
    console.log('Server listening on http://localhost:' + port);
  });
  server.on('error', onError);
}

function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
    default:
      throw error;
  }
}
module.exports = app;
