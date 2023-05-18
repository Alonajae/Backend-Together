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
    reason: String,
    photoId: String,
    profilePicture: String,
    validationVideo: String,
    visibleOnMap: Boolean,
    emergencyContact: String,
    currentLocation: coordinateSchema,
});

const User = mongoose.model('users', userSchema);

module.exports = User;
