const express = require('express');
const app = express();
const morgan = require('morgan');
const tourRouter = require(`${__dirname}/routes/tourRoutes`);
const userRouter = require(`${__dirname}/routes/userRoutes`);

// MIDDLEWARES
app.use(express.json()); // to be able to access the req.body
app.use(morgan('dev'));
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
