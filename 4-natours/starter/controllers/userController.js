const User = require("../model/userModel");
const APIFeatures = require("../utils/apiFeatures")
const catchAsync = require("../utils/catchAsync");

exports.getAllUsers = catchAsync(async (req, res) => {
    const features = new APIFeatures(User.find(), req.query)
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

    res.status(500).json({
        status: "error",
        message: "Service is unavailable"
    })
});

exports.getUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "Service is unavailable"
    })
}

exports.createUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "Service is unavailable"
    })
}

exports.updateUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "Service is unavailable"
    })
}

exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "Service is unavailable"
    })
}