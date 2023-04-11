//var createError = require('http-errors');
var express = require('express');
var expressHbs = require('express-handlebars')
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config/database');
var path = require('path')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var apiRouter = require('./routes/api');

var app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use("/style", express.static(path.join(__dirname, "./public/style")));
app.engine('.hbs', expressHbs.engine({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: 'views/layouts/',
}))
app.set('view engine', '.hbs')
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/api', apiRouter);

mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });

// var cors = require('cors')

// app.use(cors());

app.use(passport.initialize());


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next();
});

module.exports = app;

const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
