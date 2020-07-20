const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("./parent.js");

const babysitterSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    city: { type: String },
    country: { type: String },
    parent: { type: Schema.Types.ObjectId, ref: 'Parent' },
    image: { type: String, },
    age: { type: Number },
    salary: { type: Number },
    availability: { type: Number },
    phone: { type: String },
    profession: { type: String },
    experience: { type: String },
    language: { type: String },
    reviews: [{
        user: { type: String },
        comments: { type: String }
    }]
}, {
    timestamps: true
});

const Babysitter = mongoose.model("Babysitter", babysitterSchema);

module.exports = Babysitter;