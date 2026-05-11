
const mongoose = require("mongoose");

const householdSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
        trim: true,
    },
    inviteCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        length: 6
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Household", householdSchema);