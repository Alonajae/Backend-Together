const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    user1: {
        user: mongoose.Schema.Types.ObjectId,
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
        user: mongoose.Schema.Types.ObjectId,
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
        user: mongoose.Schema.Types.ObjectId,
        message: String,
        date: Date,
    }],
});

const tripModel = mongoose.model('trips', tripSchema);

module.exports = tripModel;