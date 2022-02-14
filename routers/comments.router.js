const express = require("express");
const commentsRouter = express.Router();
const { deleteCommentById, updateCommentById } = require("../controllers/comments.controllers.js");

commentsRouter.delete('/:comment_id', deleteCommentById)
commentsRouter.patch('/:comments_id', updateCommentById)

module.exports = commentsRouter