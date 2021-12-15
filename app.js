const path = require('path');
const cookieParser = require('cookie-parser');
const express = require('express');
// const productRouter = require('./routes/productRoutes');
// const purchaseRouter = require('./routes/purchaseRoutes');
// const viewRouter = require('./routes/viewRouter');
// const globalErrorHandler = require('./controllers/errorController');

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
// app.use('/', (req, res) => {
//   res.status(200).json({
//     hello: 'world',
//   });
// });
// app.use('/', viewRouter);
// app.use('/api/v1/products', productRouter);
// app.use('/api/v1/purchases', purchaseRouter);

app.get('/', function (req, res) {
  res.status(200).send('hello world');
});

// Any time an error is passed into next, call this global error handler
// app.use(globalErrorHandler);

module.exports = app;
