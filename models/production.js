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
            length: Number
        }
    ],
    drill: [
        {
            panel: String,
            length: Number
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
        }
    ],
    section: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section"
        },
        name: String
    },
    created: { type: Date, default: Date.now }
})

const Production = mongoose.model("Production", productionSchema)
module.exports = Production