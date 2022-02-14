const express = require("express");
const reviewsRouter = express.Router();
const { getReviewsById, getReviews, getCommentsByReviewId, updateReviewById, postComment } = require('../controllers/reviews.controllers')

reviewsRouter.get('/:review_id', getReviewsById)
reviewsRouter.get('/', getReviews)
reviewsRouter.get('/:review_id/comments', getCommentsByReviewId)
reviewsRouter.patch('/:review_id', updateReviewById)
reviewsRouter.post('/:review_id/comments', postComment)

module.exports = reviewsRouter