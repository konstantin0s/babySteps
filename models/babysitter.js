
const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const babysitterSchema = new Schema({
  firstName: String,
  lastName: String,
  username: String,
  password: String,
  city: String,
  country: String,
  image: String,
  age: Number,
  salary: Number,
  profession: String,
  experience: String,
  english: String

}, {
  timestamps: true
});

const Babysitter = mongoose.model("Babysitter", babysitterSchema);

module.exports = Babysitter;