const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require("./userModel");
// const validator = require('validator');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "tour must has a name"],
        unique: true,
        trim: true,
        maxLength: [40, "A tour's name must has less or equal then 40 characters"],
        minLength: [10, "A tour's name must has less or equal then 40 characters"],
        // validate: [validator.isAlpha, "Tour's name must only contains only alpha characters"]
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, "A tour must have a duration"]
    },
    maxGroupSize: {
        type: Number,
        required: [true, "A tour must have a group size"]
    },
    difficulty: {
        type: String,
        required: [true, "A tour must have a difficulty"],
        enum: {
            values: [
                "easy",
                "medium",
                "difficult"
            ]
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Min rating must be above 1.0'],
        max: [5, 'Max rating must be below 5.0']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        require: [true, "tour must has a price"]
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                //this only points to docs that on NEW document creation
                return val < this.price;
            },
            message: "Discount price ({VALUE}) should be lower than price"
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, "A tour must have a description"]
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, "A tour must have a image cover"]
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    },
    startLocation: {
        //GeoJSON
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ]
}, {
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true
    }
});

tourSchema.virtual('durationWeeks').get(function (next) {
    return this.duration / 7;
});

tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tours',
    localField: '_id'
})

//DOCUMENT MIDDLE WARE run on save() and create()
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next()
});


//QUERY MIDDLEWARE
// tourSchema.pre('find', function (next)
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } });
    this.start = Date.now();
    next()
});

tourSchema.post(/^find/, function (docs, next) {
    console.log(`Query tooks ${Date.now} - ${this.start}`);
    next()
});

tourSchema.post(/^find/, function (docs, next) {
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt'
    });
    next();
});


//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
    this.pineline().unshift({ $match: { secretTour: true } });
    console.log(this.pineline());
    next();
});
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;