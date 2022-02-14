const db = require("../db/connection.js");

exports.fetchUsers = () => {
    return db.query(`SELECT username FROM users;`).then((result) => {
      return result.rows;
    });
  };
  
exports.getUserObject = (username) => {
    let usersArray = ["tickle122", "grumpy19", "happyamy2016", "cooljmessy", 'weegembump', 'jessjelly'];
  
    if (!isNaN(username)) {
      return Promise.reject({
        status: 404,
        msg: "Not Found",
      });
    }
  
    if (usersArray.includes(username)) {
      return db
        .query(`SELECT * FROM users WHERE username = $1;`, [username])
        .then((result) => {
          return result.rows[0];
        });
    } else {
      return Promise.reject({ status: 400, msg: "Bad Request" });
    }
  };