const path = require('path');
const cookieParser = require('cookie-parser');
const express = require('express');
const projectRouter = require('./routes/projectRoutes');
const articleRouter = require('./routes/articleRoutes');
const globalErrorHandler = require('./controllers/errorController');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Route Configuration
app.use('/', viewRouter);
app.use('/api/v1/projects', projectRouter);
app.use('/api/v1/articles', articleRouter);

app.get('/', function (req, res) {
  res.status(200).send('hello world');
});

// Any time an error is passed into next, call this global error handler
app.use(globalErrorHandler);

module.exports = app;
