
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    householdId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Household',
        default: null
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("User", userSchema);