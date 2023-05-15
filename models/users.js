const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    inscriptionDate: Date,
    age: Number,
    genre: String,
    photoId: String,
    profilePicture: String,
    validationVideo: String,
});

const User = mongoose.model('users', userSchema);

module.exports = User;
