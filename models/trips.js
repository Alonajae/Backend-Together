const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    token: String,
    user1: {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
        from: {
            coordinate: {
                latitude: Number,
                longitude: Number,
            }
        },
        to: {
            coordinate: {
                latitude: Number,
                longitude: Number,
            }
        },
    },
    user2: {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
        from: {
            coordinate: {
                latitude: Number,
                longitude: Number,
            }
        },
        to: {
            coordinate: {
                latitude: Number,
                longitude: Number,
            }
        },
    },
    sharedTrip: {
        from: {
            coordinate: {
                latitude: Number,
                longitude: Number,
            },
        },
        to: {
            coordinate: {
                latitude: Number,
                longitude: Number,
            }
        },
        start: Date,
    },
    end: Date,
    chat: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'messages' },
        message: String,
        date: Date,
    }],
});

const Trip = mongoose.model('trips', tripSchema);

module.exports = Trip;