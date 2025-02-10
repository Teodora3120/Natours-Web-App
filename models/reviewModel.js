const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Revire cannot be empty!'],
      trim: true,
      maxlength: [
        500,
        'The review is too long, please keep it shorter ( less than 500 characters)',
      ],
      minlength: [1, 'Please write something about the tour!'],
    },
    rating: {
      type: Number,
      min: [1, 'A rating must be at least 1.0!'],
      max: [5, 'A rating cannot be greater than 5.0!'],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to an user.'],
    },
    createdAt: { type: Date, default: Date.now() },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name photo' })
    .populate({
      path: 'tour',
      select: 'name',
    })
    .select('-__v');
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
