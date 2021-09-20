const { resolveInclude } = require('ejs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emailSchema = new Schema({
    snippet: {
        type: String,
        required: true,
        match: /.+\@.+\..+/,
        unique: true
    }
}, { timestamps: true});

const Email = mongoose.model('email', emailSchema);
module.exports = Email;