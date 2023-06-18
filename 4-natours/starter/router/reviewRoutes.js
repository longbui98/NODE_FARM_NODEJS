const express = require("express");
const reviewController = require("../controllers/reviewController");

const reviewRouter = express.Router();

//Get all reviews or create a new review
reviewRouter.route("/")
    .get(reviewController.getReviews)
    .post(reviewController.createReview);


module.exports = reviewRouter;
