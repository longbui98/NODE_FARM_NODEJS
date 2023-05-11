const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const signToken = id => jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
});

const checkUserExist = async function (email) {
    return await User.findOne({ email }).select('+password');
}


exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    })
    const token = signToken(newUser._id);

    res.status(201).json({
        status: "success",
        token,
        data: {
            user: newUser
        }
    })
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    //1) Check if email and password exist
    // 1) Check if email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }
    // 2) Check if user exists && password is correct
    // const user = checkUserExist(email);
    const user = await User.findOne({ email }).select('+password');

    console.log(user);

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }
    //3) If everything is okay, send token to client
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    })
});

exports.protect = catchAsync(async (req, res, next) => {
    //1) Getting token and check of its there
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return next(new AppError("You are not logged in! Please log in to get access", 401));
    }
    //2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    //3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError("User has not been found", 404));
    }
    //4) Check if user changed password after the token was issued

    next();
})