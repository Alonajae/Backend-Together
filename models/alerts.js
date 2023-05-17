const mongoose = require('mongoose');

const coordinateSchema = new mongoose.Schema({
    latitude: Number,
    longitude: Number,
},
    { _id: false }
);

const alertSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    coordinate: coordinateSchema,
    date: Date,
    type: String,
    description: String,
});

const Alert = mongoose.model('alerts', alertSchema);

module.exports = Alert;
