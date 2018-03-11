const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const loki = require('lokijs');

const db = new loki('machines.db');
const total = db.addCollection('total');
const totalDoc = total.insert({name: 'motors', no: 0});
const motors = db.addCollection('motors', {
    unique: ['mno'],
    disableChangesApi: false
});
const healthCheck = db.addCollection('health', {
    unique: ['mno'],
    disableChangesApi: false
});

const index = require('./routes/index')(db, total, totalDoc, motors, healthCheck);
const health = require('./routes/health')(db, total, totalDoc, motors, healthCheck);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'njk');

nunjucks.configure(path.join(__dirname, 'views'), {
    autoescape: true,
    express: app
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/health', health);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error.html');
});

module.exports = app;
