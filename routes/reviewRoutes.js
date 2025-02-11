const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// POST /tour/as344fgdd/reviews
// GET /tour/as344fgdd/reviews

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.getAllReviews,
  )
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview,
  );

router
  .route('/:id')
  .delete(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.deleteReview,
  )
  .patch(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.updateReview,
  );
module.exports = router;
