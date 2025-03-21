const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking') {
    res.locals.alert =
      "Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up here immediatly, please come back later. ";
  }
  next();
};

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All Tours',
    tours: tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tourSlug = req.params.slug;
  const tour = await Tour.findOne({ slug: tourSlug })
    .populate({ path: 'guides' })
    .populate({ path: 'reviews', fields: 'review rating user' });

  if (!tour) {
    return next(new AppError('There is not tour with that name!', 404));
  }
  res.status(200).render('tour', {
    title: tour.name,
    tour: tour,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', { title: 'Log into your account' });
};

exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', { title: 'Create your account' });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', { title: 'Your account' });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });

  const tourIDs = bookings.map((el) => el.tour);

  const tours = await Tour.find({ _id: { $in: tourIDs } });
  res.status(200).render('overview', { title: 'My Tours', tours: tours });
});
