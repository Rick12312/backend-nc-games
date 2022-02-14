const express = require("express");
const usersRouter = express.Router();
const { getUsers, getUsersByUsername } = require('../controllers/users.controllers.js')

usersRouter.get('/', getUsers)
usersRouter.get('/:username', getUsersByUsername)

module.exports = usersRouter