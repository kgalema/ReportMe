const mongoose = require("mongoose")


// ====================
// Plant Feed Schema
// ====================
const plantFeedSchema = new mongoose.Schema({
    budget: Number,
    forecast: Number,
    actual: Number,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    },
    created: { type: Date, default: Date.now }
})

const PlantFeed = mongoose.model("PlantFeed", plantFeedSchema)
module.exports = PlantFeed