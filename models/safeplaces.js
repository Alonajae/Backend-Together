const mongoose = require('mongoose');

const coordinateSchema = new mongoose.Schema({
    latitude: Number,
    longitude: Number,
});

const safeplaceSchema = new mongoose.Schema({
    address: String,
    coordinate: coordinateSchema,
    hours: String,
    phone: String,
});

const SafePlace = mongoose.model('safeplaces', safeplaceSchema);

module.exports = SafePlace;