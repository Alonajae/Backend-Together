const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    user: mongoose.Schema.Types.ObjectId,
    coordinate: {
        latitude: Number,
        longitude: Number,
    },
    date: Date,
    type: String,
    description: String,
});

const alertModel = mongoose.model('alerts', alertSchema);

module.exports = alertModel;
