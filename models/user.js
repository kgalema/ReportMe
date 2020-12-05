const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")


// ====================
// UserSchema Schema
// ====================
const userSchema = new mongoose.Schema({
    // username: {
    //     type: String,
    //     required: [true, "Username cannot be blank"]
    // },
    // password: {
    //     type: String,
    //     required: [true, "Password cannot be blank"]
    // },
    email: {
        type: String,
        unique: true,
        required: [true, "email cannot be blank"]
    },
    isAdmin: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

    created: { type: Date, default: Date.now }

})

userSchema.plugin(passportLocalMongoose)


const User = mongoose.model("User", userSchema)
module.exports = User