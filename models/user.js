const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    // name: String,
    // email: String,
    // hairColor: String,
    // hairType: String,
    // eyeColor: String,
    // password: String,
    // type: {type: String, enum:['user', 'admin'], default: 'user'},
    // imgName: String,
    // imgPath: {type: String, default: 'https://res.cloudinary.com/dxemyxjas/image/upload/v1551523115/rooms-app/profile-no.png'},
    // token: String,
    // status: { type: String, enum: ['active', 'pending'], default: 'pending' },
    // facebookId: String,
    // googleID: String
    name: String,
    email: String,
    password: String,
    cpf: String,
    phone: String,
    sex: String,
    birth: {
        day: String,
        month: String,
        year: String
    },
    hairColor: String,
    hairLength: String,
    hairType: String,
    eyeColor: String,
    skinTone: String,
    ethnicity: String,
    hip: String,
    waist: String,
    bust: String,
    weight: String,
    height: String,
    profileImg: { type: String, default: 'https://res.cloudinary.com/dxemyxjas/image/upload/v1551523115/rooms-app/profile-no.png' },
    instagramProfile: String,
    bankAccount: String,
    type: { type: String, enum: ['user', 'admin'], default: 'user' },
    facebookId: String,
    googleID: String
});

module.exports = mongoose.model('User', userSchema);

