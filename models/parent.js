const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const parentSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    city: { type: String },
    country: { type: String },
    image: { type: String },
    kids: { type: Number },
    days: { type: Number },
    phone: { type: String }
}, {
    timestamps: true
});

const Parent = mongoose.model("Parent", parentSchema);

module.exports = Parent;