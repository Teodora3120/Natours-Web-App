const morgan = require('morgan');
const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const rateLimit = require('express-rate-limit');
const AppError = require('./utils/appError');
const errorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// GLOBAL MIDDLEWARES
app.use(express.json()); // to be able to access the req.body
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 1000 * 60 * 60,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//IF A REQUEST REACHES THIS POINT, THEN THE ROUTE DOESN'T EXISTS

app.all('*', (req, res, next) => {
  const err = new AppError(
    `Can't find ${req.originalUrl} on this server!`,
    404,
  );
  next(err);
});

app.use(errorHandler);
module.exports = app;
