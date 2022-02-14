const { fetchUsers, getUserObject } = require("../models/users.models");

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((username) => {
      res.status(200).send({ users: username });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsersByUsername = (req, res, next) => {
  let { username } = req.params;
  getUserObject(username)
    .then((user) => {
      res.status(200).send({ user: user });
    })
    .catch((err) => {
      next(err);
    });
};
