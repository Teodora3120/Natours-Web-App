const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
);

exports.checkID = (req, res, next, val) => {
  if (val > tours.length - 1) {
    return res.status(404).json({
      status: 'Fail',
      message: 'Invalid ID',
    });
  }
  next();
};

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
    results: tours.length,
    requestedAt: req.requestTime,
    data: {
      tours: tours,
    },
  });
};

exports.getTour = (req, res) => {
  const tourId = Number(req.params.id);
  const tour = tours.find((item) => item.id === tourId);
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
  // console.log(req.body)
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) {
        console.log(err);
      }
    },
  );
  res.status(201).json({
    message: 'success',
    data: {
      tour: newTour,
    },
  });
};

exports.updateTour = (req, res) => {
  const tourId = Number(req.params.id);
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
