const {
  deleteComment,
  patchCommentById,
} = require("../models/comments.models");

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  deleteComment(comment_id)
    .then(() => {
      res.status(204).send({ msg: "Deleted comment" });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateCommentById = (req, res, next) => {
  let { inc_votes } = req.body;
  let { comments_id } = req.params;

  patchCommentById(inc_votes, comments_id)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
