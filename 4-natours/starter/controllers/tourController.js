const Tour = require("../model/tourModel");
const APIFeatures = require("../utils/apiFeatures")
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// exports.checkBody = (req, res, next) => {
//     if (!req.body.name || !req.body.price) {
//         return res.status(400).json({
//             status: 'fail',
//             message: 'Missing name or price'
//         })
//     }
// }
exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
}

exports.getAllTours = catchAsync(async (req, res) => {

    // //BUILD QUERY
    // //1A- Filtering
    // const queryObj = { ...req.query };
    // const excludeFields = ['page', 'limit', 'fields'];
    // excludeFields.forEach((value) => delete queryObj[value]);

    // //1B- Advanced filtering
    // let queryString = JSON.stringify(queryObj);
    // queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    //EXECUTE QUERY
    //2)- Sorting  
    // if (req.query.sort) {
    //     const sortBy = req.query.sort.split(',').join(' ');
    //     query = query.sort(sortBy);
    // } else {
    //     query = query.sort("-createdAt");
    // }
    //3) Limiting Fields
    // if (req.query.fields) {
    //     const fields = req.query.fields.split(',').join(" ");
    //     query = query.select(fields);
    // } else {
    //     query = query.select("-__v");
    // }

    //4) Pagination
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;

    // query = query.skip(skip).limit(limit);

    // if (req.query.page) {
    //     const numDocs = await Tour.countDocuments();
    //     if (skip >= numDocs) throw new Error("This page does not exist");
    // }

    //EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .panigating();
    const toursDate = await features.query;

    res.status(200).json({
        results: toursDate.length,
        status: 'Success',
        data: {
            toursDate
        }
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
        return next(new AppError('No tour found with that ID', 404));
    }
    res.status(200).json({
        status: 'Success',
        data: {
            tour
        }
    });

});


exports.createTour = catchAsync(async (req, res) => {
    const newTour = await Tour.create(req.body);

    res.status(200).json({
        message: "success",
        data: {
            data: newTour
        }
    })

});

exports.updateTour = catchAsync(async (req, res) => {

    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        message: "success",
        data: {
            tour
        }
    })

});

exports.deleteTour = catchAsync(async (req, res) => {

    const tour = await Tour.findByIdAndDelete(req.params.id);
    res.status(200).json({
        message: "success",
        data: {
            tour
        }
    })

});

exports.getTourStats = catchAsync(async (req, res) => {

    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
            }
        },
        {
            $sort: { avgPrice: 1 }
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    });
});

exports.getMonthlyPlan = catchAsync(async (req, res) => {

    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStarts: { $sum: 1 },
                tours: { $push: '$name' }
            }
        },
        {
            $addFields: { month: '$_id' }
        },
        {
            $project: {
                _id: 0
            }
        },
        {
            $sort: { numTourStarts: 1 }
        },
        {
            $limit: 12
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            plan
        }
    });

});