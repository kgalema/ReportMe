const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")


// ====================
// UserSchema Schema
// ====================
const userSchema = new mongoose.Schema({
    occupation: {
        type: String,
        required: [true, "Occupation not defined"]
    },
    department: {
        type: String,
        required: [true, "Department not defined"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email cannot be blank"]
    },
    isAdmin: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

    created: { type: Date, default: Date.now }

})

userSchema.plugin(passportLocalMongoose)


const User = mongoose.model("User", userSchema)
module.exports = User