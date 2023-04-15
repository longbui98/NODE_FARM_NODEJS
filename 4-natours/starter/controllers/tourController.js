const Tour = require("../model/tourModel");

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// exports.checkBody = (req, res, next) => {
//     if (!req.body.name || !req.body.price) {
//         return res.status(400).json({
//             status: 'fail',
//             message: 'Missing name or price'
//         })
//     }
// }

exports.getAllTours = async (req, res) => {
    try {
        //BUILD QUERY
        //1A- Filtering
        const queryObj = { ...req.query };
        const excludeFields = ['page', 'limit', 'fields'];
        excludeFields.forEach((value) => delete queryObj[value]);

        //1B- Advanced filtering
        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        //EXECUTE QUERY
        let query = Tour.find(JSON.parse(queryString));
        //2)- Sorting  
        if (req.query.sort !== undefined) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort("-createdAt");
        }
        //3) Limiting Fields
        if (req.query.fields !== undefined) {
            const fields = req.query.fields.split(',').join(" ");
            query = query.select(fields);
        } else {
            query = query.select("-__v");
        }
        const toursDate = await query;

        res.status(200).json({
            results: toursDate.length,
            status: 'Success',
            data: {
                toursDate
            }
        });
    } catch (err) {
        console.log("Error while getting data");
        res.status(500).json({
            status: "Failed",
            message: "Service is not available"
        })
    }
}

exports.getTour = async (req, res) => {
    const tour = await Tour.findById(req.params.id);
    try {
        res.status(200).json({
            status: 'Success',
            data: {
                tour
            }
        });
    } catch (err) {
        console.log(err);
        res.status(404).json({
            status: "Failed",
            message: "Resource not found"
        })
    }
};

exports.createTour = async (req, res) => {
    const newTour = await Tour.create(req.body);
    try {
        res.status(200).json({
            message: "success",
            data: {
                data: newTour
            }
        })
    } catch (err) {
        res.status(400).json({
            status: "Failed",
            message: "Invalid data sent"
        })
    }
};

exports.updateTour = async (req, res) => {
    try {
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
    } catch (err) {
        res.status(404).json({
            status: "Failed",
            message: err
        });
    }
};

exports.deleteTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "success",
            data: {
                tour
            }
        })
    } catch (err) {
        res.status(404).json({
            status: "Failed",
            message: err
        });
    }
};