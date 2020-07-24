const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Babysitter'
    },
    token: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 493200
    }
}, { timestamps: true });

const TokenSitter = mongoose.model("TokenSitter", tokenSSchema);

module.exports = TokenSitter;