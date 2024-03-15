const compression = require('compression');
const cookieParser = require('cookie-parser');
const express = require('express');
const helmet = require('helmet');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');

const AppError = require('./utils/appError');
const articleRouter = require('./routes/articleRoutes');
const globalErrorHandler = require('./controllers/errorController');
const projectRouter = require('./routes/projectRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet({contentSecurityPolicy: false}));

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Limit size of HTTP request, parse query strings
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

app.use(compression());

// Set locals for use in pug templates
app.locals.githubLink = process.env.GITHUB_LINK;
app.locals.resumeLink = process.env.RESUME_LINK;
app.locals.linkedinLink = process.env.LINKEDIN_LINK;
app.locals.sizeImageUrl = (url, size = '') => {
  if (!size) return url;
  const { name, ext } = path.parse(url);
  return name + size + ext;
};

// Route Configuration
app.use('/', viewRouter);
app.use('/api/v1/projects', projectRouter);
app.use('/api/v1/articles', articleRouter);

// Handle unknown routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}!`, 404));
});

// Any time an error is passed into next, call this global error handler
app.use(globalErrorHandler);

module.exports = app;
