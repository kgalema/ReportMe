const mongoose = require("mongoose");


const productionSchema = new mongoose.Schema({
    general: [
        {
            shift: String,
            comments: String
        }
    ],
    blast: [
        {
            panel: String,
            length: Number
        }
    ],
    clean: [
        {
            panel: String,
            length: Number,
            advance: Number

        }
    ],
    support: [
        {
            panel: String,
            length: Number,
            bolts: Number,
            anchors: Number,
            machine: String
        }
    ],
    drill: [
        {
            panel: String,
            length: Number,
            holes: Number,
            drillRig: String
        }
    ],
    prep: [
        {
            panel: String,
            length: Number
        }
    ],
    notClean: [
        {
            panel: String,
            length: Number
        }
    ],
    LHD: [
        {
            coyNumber: Number,
            LHDnumber: String,
            buckets: Number
        }
    ],
    section: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section"
        },
        name: String,
        budget: Number,
        forecast: Number,
        plannedAdvance: Number
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    uniqueCode: { type: String, unique: true },
    created: { type: Date, default: Date.now }
})


const Production = mongoose.model("Production", productionSchema)
module.exports = Production