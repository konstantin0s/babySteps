
const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
require("./parent.js");

const babysitterSchema = new Schema({
  firstName: String,
  lastName: String,
  username: String,
  password: String,
  city: String,
  country: String,
  parent:  { type : Schema.Types.ObjectId, ref: 'Parent' },
  image: String,
  age: Number,
  salary: Number,
  profession: String,
  experience: String,
  english: String,
  reviews: [ 
    {
      user: String,
      comments: String
    } 
  ]
}, {
  timestamps: true
});

const Babysitter = mongoose.model("Babysitter", babysitterSchema);

module.exports = Babysitter;