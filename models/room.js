const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    name: {type:String},
    description: {type:String},
    imgName: String,
    imgPath: {type: String, default: 'https://res.cloudinary.com/dxemyxjas/image/upload/v1551618636/rooms-app/47662.png.png'},
    location: { type: {type: String}, coordinates: [Number] },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }]
    
}, {
    timestamps: true
  });

module.exports = mongoose.model('Room', roomSchema);
