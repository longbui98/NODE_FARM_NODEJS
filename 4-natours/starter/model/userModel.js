const crypto = require('crypto');
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

//name, email, photo, password, confirmPassword
const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: [true, "User must has a name"],
        unique: true,
        trim: true,
        maxLength: [30, "A user's name must has less or equal then 30 characters"],
        minLength: [10, "A user's name must has greater or equal then 10 characters"]
    },
    email: {
        type: String,
        require: [true, "Please provide an email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "User's email must only format of email"]
    },
    photo: String,
    password: {
        type: String,
        require: [true, "Please provide a password"],
        minLength: [8, "The minimum password's length must be greater than 8"],
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    confirmPassword: {
        type: String,
        require: [true, "Please confirm a password"],
        validate: {
            validator: function (val) {
                return val === this.password
            },
            message: "Password must be matched"
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    //Hash password
    this.password = await bcrypt.hash(this.password, 12);
    //Delete passwordConfirm field
    this.confirmPassword = undefined;
    next();
});

userSchema.methods.correctPassword = async function (candiatePassword, userPassword) {
    return await bcrypt.compare(candiatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        console.log(this.passwordChangedAt, JWTTimestamp);
    }
    return false;
}

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    console.log(resetToken, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
}

const User = mongoose.model("User", userSchema);
module.exports = User