// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            require: [true, 'A review can not be empty']
        },
        rating: {
            type: Number,
            require: [true, 'A rating can not be empty'],
            min: 1,
            max: 5,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        },
        tour: {
            type: mongoose.Schema.ObjectId,
            ref: 'Tour',
            require: [true, 'Review must be belong to a tour']
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            require: [true, 'Review must be belong to a user']
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'tour',
        select: 'name'
    }).populate({
        path: 'user',
        select: 'name photo'
    });
    next();
})

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;