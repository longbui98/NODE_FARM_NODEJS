const User = require("../model/userModel");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(value => {
        if (allowedFields.includes(value)) newObj[value] = obj[value];
    })
    return newObj;
}
exports.getAllUsers = catchAsync(async (req, res) => {
    const users = await User.find();

    // SEND RESPONSE
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    });

    res.status(500).json({
        status: "error",
        message: "Service is unavailable"
    })
});

exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if the user post password data
    if (req.body.password || req.body.confirmPassword) {
        return next(new AppError('This route is not for update password. Please use updateMyPassword'), 400);
    }
    // 2) Filtering out the sentitive information
    const filterBodyData = filterObj(req.body, 'name', 'password');

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBodyData, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        status: "success",
        data: {
            user: updatedUser
        }
    })
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndDelete(req.user.id, { active: false });
    res.status(204).json({
        status: "success",
        data: null
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