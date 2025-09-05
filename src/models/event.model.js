const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
    clerkUserId: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
});

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    participantsLimit: {
        type: Number,
        required: true
    },
    availableTickets: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    participants: [participantSchema],
    createdBy: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
