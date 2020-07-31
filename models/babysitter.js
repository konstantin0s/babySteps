const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TokenSitter = require('../models/sitterToken');
require("./parent.js");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const babysitterSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
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
    }],
    resetPasswordToken: {
        type: String,
        required: false
    },

    resetPasswordExpires: {
        type: Date,
        required: false
    }
}, {
    timestamps: true
});

babysitterSchema.methods.generateJWT = function() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    let payload = {
        id: this._id,
        email: this.email,
        username: this.username
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: parseInt(expirationDate.getTime() / 1000, 10)
    });
};

babysitterSchema.methods.generatePasswordReset = function() {
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};

babysitterSchema.methods.generateVerificationToken = function() {
    let payload = {
        userId: this._id,
        token: crypto.randomBytes(20).toString('hex')
    };

    return new Token(payload);
};


const Babysitter = mongoose.model("Babysitter", babysitterSchema);

module.exports = Babysitter;