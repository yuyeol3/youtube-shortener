const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const nunjucks = require('nunjucks');

dotenv.config();
// require('./routines/index');
const indexRouter = require('./routes/index');
const apisRouter = require('./routes/apis');

const app = express();
app.set('view engine', 'html');
nunjucks.configure('public', {
    express: app,
    watch: true,
});


app.use(logger(process.env.NODE_ENV));
// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/apis', apisRouter);


module.exports = app;
