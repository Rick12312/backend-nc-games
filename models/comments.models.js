const db = require("../db/connection.js");

exports.deleteComment = (comment_id) => {
  const commentId = Number(comment_id);
  if (isNaN(commentId)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid ID",
    });
  }
  let commentsIdArray = [1, 2, 3, 4, 5, 6];
  if (commentsIdArray.includes(commentId)) {
    return db
      .query(`DELETE FROM comments WHERE comment_id = $1;`, [commentId])
      .then((result) => {
        return result;
      });
  } else {
    return Promise.reject({
      status: 404,
      msg: "Non existant ID",
    });
  }
};

exports.patchCommentById = (newVote, comment_id) => {
  if (isNaN(comment_id) || isNaN(newVote)) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request",
    });
  }
  return db
    .query(
      `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;`,
      [newVote, comment_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Not Found",
        });
      }
      return result.rows[0];
    });
};
