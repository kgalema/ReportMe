const mongoose = require("mongoose");


// ====================
// ROM Schema
// ====================
const ROMSchema = new mongoose.Schema({
    budget: Number,
    forecast: Number,
    actual: Number,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    },
    created: { type: Date, default: new Date() },

});

const ROM = mongoose.model("ROM", ROMSchema);
module.exports = ROM;