const Tour = require('../models/tourModel');

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

exports.createTour = async (req, res) => {
  console.log(req.body);
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    message: 'success',
    data: {
      tour: newTour,
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
