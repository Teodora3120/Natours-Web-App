const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');

// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name!'],
      //   trim: true,
      //   maxlength: [40, 'A name must have maximum 100 characters!'],
      //   minlength: [10, 'A name must have at least 5 characters!'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email!'],
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email!'],
    },
    photo: {
      type: String,
      //   required: [true, 'Profile photo is required!'],
    },
    role: {
      type: String,
      enum: ['user', 'guide', 'lead-guide', 'admin'],
      default: 'user',
    },
    password: {
      type: String,
      required: [true, 'Please provide a valid password!'],
      minlength: [8, 'Password must have at least 8 characters!'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password!'],
      // this only works on Create and Save methods
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: 'Passwords are not the same! ',
      },
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  // confirm password is a required field in order to compare with the actual password, but we do not need to store it in the db
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.passwordChangedAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimestamp < changedTimestamp;
  }
  // Not changed
  return false;
};

userSchema.methods.generateResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 1000 * 60 * 10;
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
