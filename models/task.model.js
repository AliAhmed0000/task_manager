const mongoose = require('mongoose');

// const status = ['pending','in-progress','done'];

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 5
    },
    status: {
        type: String,
        enum: ['pending','in-progress','done'],
        default: 'pending'
    },
    dueDate: {
        type: Date,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

module.exports = mongoose.model('Task', taskSchema);