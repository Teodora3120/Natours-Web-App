const { promisify } = require('util');
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
// eslint-disable-next-line import/no-extraneous-dependencies
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createAndSendToken = async (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      user,
    },
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
    // passwordChangedAt: req.body.passwordChangedAt,
  });

  createAndSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide an email and a password!', 400));
  }
  console.log(email, password);
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  createAndSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401),
    );
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const freshUser = await User.findById(decoded.id);

  if (!freshUser) {
    return next(
      new AppError(
        'The user belonging to this token does not longer exists.',
        401,
      ),
    );
  }

  const passwordChangedAfter = freshUser.passwordChangedAfter(decoded.iat);

  if (passwordChangedAfter) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401),
    );
  }
  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = freshUser;
  next();
});

// roles is a variable array, it can be only
// ['admin'] or it can be ['admin', 'lead-guide']
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action!', 403),
      );
    }
    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) get user based on posted email
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(
      new AppError('This email does not have a linked user account', 404),
    );
  }
  // 2) generate the random token

  const resetToken = user.generateResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  // 3) send an email with a token

  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\n If you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: email,
      subject: 'Your Password Reset Token (valid for 10 minutes)',
      message: message,
      resetURL: resetURL,
    });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    console.log(err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500,
      ),
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) GET user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // 2) If token has not expired and there is an user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or it has expired!', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // 3) Update changedPasswordAt property for the user, DONE inside the model

  // 4) Log the user in, send the JWT token to the client
  createAndSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get the user

  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if the password is correct
  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppError('Your current password is wrong!', 401));
  }
  // 3) If it is, change the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // 4) Log the user in, send the JWT
  createAndSendToken(user, 200, res);
});
