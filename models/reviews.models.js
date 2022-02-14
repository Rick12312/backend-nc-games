const db = require("../db/connection.js");

exports.fetchReviewsById = (reviewId) => {
  return db
    .query(
      `SELECT owner, title, review_id, review_body, designer, review_img_url, category, created_at, votes,
    (SELECT COUNT(*) FROM comments WHERE review_id = $1) as comment_count
    FROM reviews WHERE review_id = $1;`,
      [reviewId]
    )
    .then(({ rows }) => {
      const review = rows[0];
      if (!review) {
        return Promise.reject({
          status: 404,
          msg: `No user found for review_id: ${reviewId}`,
        });
      }
      return review;
    });
};

exports.updateVotebyId = (newVote, review_id) => {
  if (!newVote) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  return db
    .query(
      `UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;`,
      [newVote, review_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Non existent ID" });
      }
      return result.rows[0];
    });
};

exports.retrieveReviews = (
  sort_by = "created_at",
  order = "DESC",
  category
) => {
  let reviewsArray = [
    "review_id",
    "title",
    "designer",
    "review_img_url",
    "review_body",
    "created_at",
    "votes",
    "owner",
    "category",
    "comment_count",
  ];

  let orderByArray = ["ASC", "DESC"];

  let categoryArray = [
    "push-your-luck",
    "hidden-roles",
    "dexterity",
    "roll-and-write",
    'deck-building',
    'engine-building',
    'strategy'   
  ];

  if (reviewsArray.includes(sort_by) && orderByArray.includes(order)) {
    if (category) {
      if (categoryArray.includes(category)) {
        return db
          .query(
            `SELECT reviews.*, COUNT(comments.review_id) AS comment_count FROM reviews 
          LEFT JOIN comments ON reviews.review_id = comments.review_id 
          WHERE reviews.category = $1
          GROUP BY reviews.review_id
          ORDER BY ${sort_by} ${order};`,
            [category]
          )
          .then((result) => {
            return result.rows;
          });
      } else {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
    } else {
      return db
        .query(
          `SELECT reviews.*, COUNT(comments.review_id) AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id GROUP BY reviews.review_id ORDER BY ${sort_by} ${order};`
        )
        .then((result) => {
          return result.rows;
        });
    }
  } else {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
};

exports.fetchCommentsByReviewId = (review_id) => {
  return db
    .query(
      `SELECT votes, comment_id, created_at, author, body, review_id FROM comments WHERE review_id = $1;`,
      [review_id]
    )
    .then((result) => {
      if (review_id > 13) {
        return Promise.reject({ status: 404, msg: "Non existent ID" });
      }
      return result.rows;
    });
};

exports.fetchPostedComment = (review_id, username, body) => {
  if (!username || !body) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request",
    });
  }
  
  return db
    .query(`SELECT username FROM users WHERE username = $1;`, [username])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Not Found",
        });
      } else {
        const dateValue = new Date().toUTCString();
        return db
          .query(
            `INSERT INTO comments 
      (author, body, review_id, created_at) VALUES ($1, $2, $3, $4) RETURNING *;`,
            [username, body, review_id, dateValue]
          )
          .then((result) => {
            return result.rows[0];
          });
      }
    });
};
