const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['email', 'sms'],
        required: true
    },
    subject: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        required: true
    },
    variables: [{
        type: String
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Template', TemplateSchema);