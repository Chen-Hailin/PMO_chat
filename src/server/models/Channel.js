'use strict';

var mongoose = require('mongoose');

var channelSchema = mongoose.Schema({
    name: {type: String, unique: true},
    id: String,
    caseDescription: String,
    caseLocation: String,
    efForce: String,
    approved: {type: Boolean, default: false},
    private: Boolean,
    between: Array
});

module.exports = mongoose.model('Channel', channelSchema);
