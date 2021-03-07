const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    costDaily: {
        cost: {
            type: Number,
            default: 0,
        },
        lastReset: {
            type: Date,
            default: Date.now
        },
    },
    costWeekly: {
        cost: {
            type: Number,
            default: 0,
        },
        lastReset: {
            type: Date,
            default: Date.now
        },
    },
    costMonthly: {
        cost: {
            type: Number,
            default: 0,
        },
        lastReset: {
            type: Date,
            default: Date.now
        },
    },
    costYearly: {
        cost: {
            type: Number,
            default: 0,
        },
        lastReset: {
            type: Date,
            default: Date.now
        },
    },
    currency: {
        type: String,
        enum: ['CHF', 'EUR', 'USD'],
        default: 'CHF',
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
