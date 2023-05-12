const mongoose = require('mongoose');

const safeplaceSchema = new mongoose.Schema({
    address: String,
    coordinate: {
        latitude: Number,
        longitude: Number,
    },
    hours: String,
    phone: String,
});

const safeplaceModel = mongoose.model('safeplaces', safeplaceSchema);

module.exports = safeplaceModel;