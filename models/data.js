const { resolveInclude } = require('ejs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dataSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    emailAddress:{
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/
    },
    gender: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
    }
}, { timestamps: true});

const Data = mongoose.model('data', dataSchema);
module.exports = Data;