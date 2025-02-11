const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  return res.status(200).json({
    status: 'success',
    results: users.length,
    requestedAt: req.requestTime,
    data: {
      users: users,
    },
  });
});

// updating the current authenticated user (except password)
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) create error if the user is trying to update the password
  if (req.body.password || req.body.passwordConfirm) {
    next(
      new AppError(
        'You cannot change the password using this route! Please use /updatePassword.',
        400,
      ),
    );
  }

  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

// deleting the current authenticated user (active becomes false)
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {
    active: false,
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet defined!',
  });
};

exports.createUser = factory.createOne(User);

// this function is only for the admins
exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);
