const {
  categoryData,
  commentData,
  reviewData,
  userData,
} = require("../seeds/seed.js");

// exports.userFormattedData = userData.map((user) => {
//     return [
//         user.username,
//         user.name,
//         user.avatar_url
//     ];
//   });

exports.formatUserData = (userData) => {
  return userData.map((user) => {
    return [user.username, user.name, user.avatar_url];
  });
};

exports.reviewFormattedData = (reviewData) => {
  return reviewData.map((review) => {
    return [
      review.title,
      review.review_body,
      review.designer,
      review.review_img_url,
      review.votes,
      review.owner,
      review.category,
      review.created_at,
    ];
  });
};

exports.commentFormattedData = (commentData) => {
  return commentData.map((comment) => {
    return [
      comment.body,
      comment.votes,
      comment.author,
      comment.review_id,
      comment.created_at,
    ];
  });
};

exports.categoryFormattedData = (categoryData) => {
   return categoryData.map((categories) => {
    return [
        categories.slug, 
        categories.description
    ];
    });
}

