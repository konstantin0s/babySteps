
const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const parentSchema = new Schema({
  firstName: String,
  lastName: String,
  city: String,
  country: String,
  kids: Number,
  days: String  //Array ?
}, {
  timestamps: true
});

const Parent = mongoose.model("Parent", parentSchema);

module.exports = Parent;