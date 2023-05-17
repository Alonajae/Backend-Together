const mongoose = require('mongoose');

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
    validationVideo: String,
    visibleOnMap: Boolean,
    emergencyContact: String,
});

const User = mongoose.model('users', userSchema);

module.exports = User;
