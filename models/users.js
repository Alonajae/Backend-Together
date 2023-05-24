const mongoose = require('mongoose');

const coordinateSchema = new mongoose.Schema({
    latitude: Number,
    longitude: Number,
},
    { _id: false }
);

const userSchema = new mongoose.Schema({
    token: String,
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    inscriptionDate: Date,
    age: Number,
    reasons: String,
    photoId: String,
    profilePicture: String,
    visibleOnMap: Boolean,
    emergencyContact: String,
    validationVideo: String,
    accessGranted: Boolean,
    isSearching: Boolean,
    itinerary: Array,
    currentLocation: coordinateSchema,
});

const User = mongoose.model('users', userSchema);

module.exports = User;
