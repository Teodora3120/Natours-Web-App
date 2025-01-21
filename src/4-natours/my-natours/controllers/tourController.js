const Tour = require('../models/tourModel');

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'Fail',
      message: 'Missing name or price!',
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: [],
    requestedAt: req.requestTime,
    data: {
      tours: [],
    },
  });
};

exports.getTour = (req, res) => {
  const tourId = Number(req.params.id);
  res.status(200).json({
    status: 'success',
    data: {},
  });
};

exports.createTour = (req, res) => {
  console.log(req.body);
  res.status(201).json({
    message: 'success',
    data: {
      tour: '',
    },
  });
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {},
  });
};

exports.deleteTour = (req, res) => {
  const tourId = Number(req.params.id);
  res.status(204).json({
    status: 'success',
    data: `Object with id ${tourId} is deleted!`,
  });
};
