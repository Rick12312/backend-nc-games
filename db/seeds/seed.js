const seed = (data) => {
  const { categoryData, commentData, reviewData, userData } = data;

  const format = require("pg-format");
  const db = require("../connection.js");

  return db
    .query(`DROP TABLE IF EXISTS comments;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS reviews;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS categories;`);
    })
    .then(() => {
      return db.query(
        `CREATE TABLE categories (
          slug VARCHAR(200) PRIMARY KEY NOT NULL,
          description VARCHAR(200) NOT NULL
        );`
      );
    })
    .then(() => {
      return db.query(
        `CREATE TABLE users (
          username VARCHAR(20) PRIMARY KEY,
          name VARCHAR NOT NULL,
          avatar_url TEXT NOT NULL
        );`
      );
    })
    .then(() => {
      return db.query(
        `CREATE TABLE reviews (
          review_id SERIAL NOT NULL PRIMARY KEY,
          title VARCHAR(250) NOT NULL,
          designer VARCHAR(200) NOT NULL,          
          review_img_url TEXT DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
          review_body TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          votes INT DEFAULT 0,
          owner VARCHAR(200) REFERENCES users (username),
          category VARCHAR(200) REFERENCES categories (slug)
        );`
      );
    })
    .then(() => {
      return db.query(
        `CREATE TABLE comments (
          body TEXT NOT NULL,
          comment_id SERIAL PRIMARY KEY,
          author VARCHAR(250) NOT NULL,
          votes INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT NOW(),
          review_id INT REFERENCES reviews (review_id) ON DELETE CASCADE
        );`
      );
    })
    .then(() => {
      const categoryFormattedData = categoryData.map((categories) => {
        return [categories.slug, categories.description];
      });
      const categoriesInsertStr = format(
        `INSERT INTO categories
          (slug, description)
        VALUES %L RETURNING *;`,
        categoryFormattedData
      );
      return db.query(categoriesInsertStr);
    })
    .then(() => {
      const userFormattedData = userData.map((user) => {
        return [user.username, user.name, user.avatar_url];
      });
      const userInsertStr = format(
        `INSERT INTO users
          (username, name, avatar_url)
        VALUES %L RETURNING *;`,
        userFormattedData
      );
      return db.query(userInsertStr);
    })
    .then(() => {
      const reviewFormattedData = reviewData.map((review) => {
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
      const reviewDataStr = format(
        `INSERT INTO reviews
          (title, review_body, designer, review_img_url, votes, owner, category, created_at)
        VALUES %L RETURNING *;`,
        reviewFormattedData
      );
      return db.query(reviewDataStr);
    })
    .then(() => {
      const commentFormattedData = commentData.map((comment) => {
        return [
          comment.body,
          comment.votes,
          comment.author,
          comment.review_id,
          comment.created_at,
        ];
      });
      const commentDataStr = format(
        `INSERT INTO comments
          (body, votes, author, review_id, created_at)
        VALUES %L RETURNING *;`,
        commentFormattedData
      );
      return db.query(commentDataStr);
    });
};

module.exports = seed;
