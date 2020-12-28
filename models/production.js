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
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    uniqueCode: { type: String, unique: true },
    created: { type: Date, default: Date.now }
})

// productionSchema.index({
//     "general.shift": 1,
//     section: 1
// }, {
//     unique: true,
// });

// productionSchema.index({ "general.shift": 1, section: 1, created: 1 }, { unique: true, dropDups: true })

const Production = mongoose.model("Production", productionSchema)
module.exports = Production