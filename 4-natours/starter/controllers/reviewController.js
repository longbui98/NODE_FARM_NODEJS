const Review = require("../model/reviewsModel");
const APIFeatures = require("../utils/apiFeatures")
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getReviews = catchAsync(async (req, res) => {
    const reviews = await Review.find();

    res.status(200).json({
        status: 'success',
        data: {
            reviews
        }
    });
});

exports.createReview = catchAsync(async (req, res) => {
    const newReview = await Review.create(req.body);

    res.status(200).json({
        status: 'success',
        data: {
            data: newReview
        }
    });
});