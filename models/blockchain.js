const mongoose = require('mongoose');

const blockchainSchema = new mongoose.Schema({
    nameShort: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        required: true,
    },
    tps: {
        type: Number,
        required: true,
    },
    blockTime: {
        type: Number,
        required: true,
    },
    maxTrxSize: {
        type: Number,
        required: true,
    },
    turingComplete: {
        type: Boolean,
        required: true,
    },

});

const Blockchain = mongoose.model('Blockchain', blockchainSchema);

module.exports = Blockchain;
