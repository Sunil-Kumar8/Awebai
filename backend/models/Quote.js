const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: String,
        trim: true,
        default: ''
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
    },
    company: {
        type: String,
        trim: true,
        default: 'N/A'
    },
    website: {
        type: String,
        trim: true,
        default: 'N/A'
    },
    service: {
        type: String,
        required: [true, 'Service type is required'],
        trim: true
    },
    budget: {
        type: String,
        required: [true, 'Budget range selection is required'],
        trim: true
    },
    timeline: {
        type: String,
        required: [true, 'Timeline range selection is required'],
        trim: true
    },
    message: {
        type: String,
        required: [true, 'Project details are required'],
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Quote', quoteSchema);
