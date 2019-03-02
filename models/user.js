const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    imgName: String,
    imgPath: {type: String, default: 'https://res.cloudinary.com/dxemyxjas/image/upload/v1551523115/rooms-app/profile-no.png'},
    token: String,
    status: { type: String, enum: ['active', 'pending'], default: 'pending' },
    facebookID: String,
    googleID: String
});

module.exports = mongoose.model('User', userSchema);
