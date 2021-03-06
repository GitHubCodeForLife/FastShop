require('dotenv').config()
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
//Nodemailer
require('./config/nodemailer');
//passport, flash, session
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
require('./config/passport')(passport);
//
const Handlebars = require("hbs");
var MongoStore = require('connect-mongo')(session);
//Router 
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const apiRouter = require('./routes/api');
const productsRouter = require('./routes/products');
const promotionsRouter = require('./routes/promotions');
const app = express();
//require mongodb
const mongo = require('./database/db');
const { compareSync } = require('bcrypt');
const {setUpNotification} = require('./config/notification');
// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
      client: mongo.client,
      dbName: 'Shopping_cart'
    }),
    cookie: { maxAge: 180 * 60 * 1000 }
  })
);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
// Connect flash
app.use(flash());

// Global variables
app.use(async function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});
//Hbs Helper
Handlebars.registerHelper('cond', function (v1, v2, options) {
  if (v1 === v2) {
    return options.fn(this);
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//set up notification when user login
app.use(setUpNotification);



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);
app.use('/products', productsRouter);
app.use('/promotions', promotionsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
