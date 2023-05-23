const mongoose = require('mongoose');

const coordinateSchema = new mongoose.Schema({
    latitude: Number,
    longitude: Number,
},
    { _id: false }
);

const userSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    from: coordinateSchema,
    to: coordinateSchema,
    isArrived: Boolean,
},
    { _id: false }
);

const chatSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'messages' },
    message: String,
    date: Date,
},
    { _id: false }
);

const sharedTripSchema = new mongoose.Schema({
    from: coordinateSchema,
    to: coordinateSchema,
    start: Date,
},
    { _id: false }
);

const tripSchema = new mongoose.Schema({
    token: String,
    user1: userSchema,
    user2: userSchema,
    sharedTrip: sharedTripSchema,
    end: Date,
    chat: [chatSchema],
});

const Trip = mongoose.model('trips', tripSchema);

module.exports = Trip;