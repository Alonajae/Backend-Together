const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    message: String,
    date: Date,
});

const Message = mongoose.model('messages', messageSchema);

module.exports = Message;
