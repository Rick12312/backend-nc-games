const {
  fetchReviewsById,
  updateVotebyId,
  retrieveReviews,
  fetchCommentsByReviewId,
  fetchPostedComment,
} = require("../models/reviews.models.js");

exports.getReviewsById = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewsById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateReviewById = (req, res, next) => {
  const { inc_votes } = req.body;
  const { review_id } = req.params;
  updateVotebyId(inc_votes, review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviews = (req, res, next) => {
  const { sort_by, order, category } = req.query;
  retrieveReviews(sort_by, order, category)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  fetchCommentsByReviewId(review_id)
    .then((comments) => {
      res.status(200).send({ comments: comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { review_id } = req.params;
  const { username, body } = req.body;
  fetchPostedComment(review_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReadEndpointReadme = (req, res, next) => {
  res
    .status(200)
    .send({
      endpoints: [
        {
          url: "api/categories",
          method: "GET",
          description: "Responds with an array of category objects",
        },
        {
          url: "/api/reviews/:review_id",
          method: "GET",
          description: "Responds an array of category objects",
        },
        {
          url: "/api/reviews/:review_id",
          method: "PATCH",
          description: "Responds with updated review",
        },
        {
          url: "/api/reviews",
          method: "GET",
          description:
            "Responds with a reviews array of review objects, accepts sort_by, order & category queries",
        },
        {
          url: "/api/reviews/:review_id/comments",
          method: "GET",
          description:
            "Responds with an array of comments for the given review_id",
        },
        {
          url: "/api/reviews/:review_id/comments",
          method: "POST",
          description: "Responds with posted comment",
        },
        {
          url: "/api",
          method: "GET",
          description:
            "Responds with JSON describing all the available endpoints on the API",
        },
        {
          url: "/api/comments/:comment_id",
          method: "DELETE",
          description: "Deletes comment by comment_id",
        },
        {
          url: "/api/users",
          method: "GET",
          description: "Responds with an with an array of usernames",
        },
        {
          url: "/api/users/:username",
          method: "GET",
          description:
            "Responds with a user object when passed a username that has the following properties username, avatar_url & name",
        },
        {
          url: "/api/comments/:comment_id",
          method: "PATCH",
          description:
            "Request takes an object with new vote and will update the comments votes and respond with updated comment",
        },
      ],
    })
    .catch((err) => {
      next(err);
    });
};
