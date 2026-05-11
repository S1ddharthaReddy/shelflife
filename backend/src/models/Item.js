
const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    householdId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Household',
        required: true
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        enum: ['produce', 'dairy', 'meat', 'pantry', 'frozen', 'other'],
        default: 'other'
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1
    },
    expiryDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['used', 'wasted'],
        default: null
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Item', itemSchema);