const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
    isActive: {
        type: Boolean,
        default: false,
    },
    username: {
        type: String,
        required: true,
    },
    preferredBC: {
        type: Array,
        default: [],
    },
    currency: {
        type: String,
        enum: ['CHF', 'EUR', 'USD'],
        default: 'CHF',
    },
    cost: {
        type: Number,
    },
    interval: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly', 'default']
    },
    bcType: {
        type: String,
    },
    bcTps: {
        type: Number,
    },
    bcBlockTime: {
        type: Number,
    },
    bcDataSize: {
        type: Number,
    },
    //Rati ML feature
    bcSmartContract:{
        type: Boolean,
        default: false,
    },
    bcTuringComplete: {
        type: Boolean,
        default: false,
    },
    //Rati ML feature 
    popularity: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low',
    },
    split: {
        type: Boolean,
        default: false,
    },
    timeFrameStart: {
        type: String,
        default: '00:00',
    },
    timeFrameEnd: {
        type: String,
        default: '00:00',
    },
    costProfile: {
        type: String,
        enum: ['economic', 'performance'],
        default: 'economic',
    },
    //Rati ML feature
    useMachineLearning: {
        type: Boolean,
        default: false,
    },
});

const Policy = mongoose.model('Policy', policySchema);

module.exports = Policy;
