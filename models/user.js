const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    imageUrl: String,
    token: String,
    status: {type: String, enum:['active', 'pending'], default:'pending'},
    facebookID: String,
    googleID: String
});

module.exports = mongoose.model('User', userSchema);
