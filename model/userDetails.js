const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    firstname:{type: String},
    secondname:{type: String},
    email: {type: String, required: true},
    password: {type: String, required: true},
    shortUrl: { type: String }

})

module.exports = mongoose.model("UserDetails", userSchema)