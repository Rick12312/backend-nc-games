const express = require("express");
const apiRouter = express.Router();
const categoriesRouter = require('./categories.router')
const reviewsRouter = require('./reviews.router')
const usersRouter = require('./users.router')
const commentsRouter = require('./comments.router')

const { getReadEndpointReadme } = require("../controllers/reviews.controllers");

apiRouter.use('/categories', categoriesRouter)
apiRouter.use('/reviews', reviewsRouter)
apiRouter.use('/users', usersRouter)
apiRouter.use('/comments', commentsRouter)

apiRouter.get('/', getReadEndpointReadme)

module.exports = apiRouter
