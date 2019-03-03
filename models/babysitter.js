
const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const babysitterSchema = new Schema({
  firstName: String,
  lastName: String,
  username: String,
  password: String,
  city: String,
  country: String,
  age: Number,
  salary: Number  //Array ?
}, {
  timestamps: true
});

const Babysitter = mongoose.model("Babysitter", babysitterSchema);

module.exports = Babysitter;