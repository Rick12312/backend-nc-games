const db = require("../db/connection.js");

exports.fetchCategories = () => {
    return db.query(`SELECT * FROM categories;`).then((response) => {
    return response.rows;
  });
};
