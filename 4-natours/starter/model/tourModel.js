const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "tour must has a name"],
        unique: true
    },
    rating: {
        type: Number,
        default: 4.5
    },
    price: {
        type: Number,
        require: [true, "tour must has a price"]
    }
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;