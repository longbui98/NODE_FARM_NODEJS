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

exports.getAllTours = (req, res) => {
    res.status(200).json({
        requestedAt: req.requestTime,
        status: 'Success',
    });
}

exports.getTour = (req, res) => {
    const id = req.params.id * 1;

    res.status(200).json({
        status: 'Success',
    });
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

exports.updateTour = (req, res) => {
    res.status(200).json({
        message: "success",
    })
};

exports.deleteTour = (req, res) => {
    res.status(204).json({
        message: "success",
    })
};