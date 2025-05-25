const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    number: {
        type: String,
        required: true,
        unique: true,
        match: /^[0-9+\s]{9,16}$/
    },
    rol: {
        type: String,
        required: true,
        enum: ['admin', 'client']
    },
    travelInteractions: [{
        travel: { type: mongoose.Schema.Types.ObjectId, ref: 'travels', required: true },
        type: { type: String, enum: ['liked', 'saved', 'bought'], required: true }
    }],
    ratedTravels: [{
        travel: { type: mongoose.Schema.Types.ObjectId, ref: 'travels', required: true },
        rating: { type: Number, min: 1, max: 5, required: true }
    }],
    commentedTravels: [{
        travel: { type: mongoose.Schema.Types.ObjectId, ref: 'travels', required: true },
        comment: { type: String, trim: true, required: true }
    }],
    conversations: [{
        user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true}],
        messages: [{
            isMine: { type: Boolean, required: true },
            text: { type: String, required: true},
            messageDate: { type: Date}
        }]
    }]
});

let User = mongoose.model('users', userSchema);
module.exports = User;