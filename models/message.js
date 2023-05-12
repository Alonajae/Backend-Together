const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    user: mongoose.Schema.Types.ObjectId,
    message: String,
    date: Date,
});

const Message = mongoose.model('messages', messageSchema);

module.exports = Message;
