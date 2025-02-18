const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

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
  res.status(200).render('tour', {
    title: tour.name,
    tour: tour,
  });
});

exports.getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).render('login', { title: 'Log into your account' });
});

exports.getSignupForm = catchAsync(async (req, res, next) => {
  res.status(200).render('signup', { title: 'Create your account' });
});
