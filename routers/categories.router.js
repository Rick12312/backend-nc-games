const express = require("express");
const categoriesRouter = express.Router();
const { getCategories } = require('../controllers/category.controllers');

categoriesRouter.get('/', getCategories)

module.exports = categoriesRouter