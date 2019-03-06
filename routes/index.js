const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Room = require('../models/room');
const Review = require('../models/review');
const uploadCloud = require('../config/cloudinary.js');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

//GET => render home
router.get('/', (req, res, next) => {
    
    res.render('index');
});

//GET => render add new user
router.get('/users/new', (req, res, next) => {
    res.render('user/new');
});
//GET => render users
router.get('/users', (req, res, next) => {
    User.find({}, (error, usersFromDB) => {
        if (error) {
            next(error);
        } else {
            if(req.user && req.user.type == 'admin'){
                res.render('user/users', {
                    users: usersFromDB
                })
            }else{
                res.render('not-found');
            }
        }
    })
});
//POST => create a new user to db
router.post('/users', uploadCloud.single('photo'), (req, res, next) => {


    const {
        name,
        email,
        password,
        type
    } = req.body;

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const newUser = new User({
        name,
        email,
        imgName: req.file ? req.file.originalname : 'default',
        imgPath: req.file ? req.file.url : 'https://res.cloudinary.com/dxemyxjas/image/upload/v1551523115/rooms-app/profile-no.png',
        password: hashPass,
        type
    });

    newUser.save(error => {
        if (error) {
            next(error);
        } else {
            res.redirect('/users')
        }
    })
})
//GET => get the form pre-filled with the details of one user
router.get('/users/:user_id/edit', (req, res, next) => {
    User.findById(req.params.user_id, (error, user) => {
        if (error) {
            next(error);
        } else {
            res.render('user/edit', {
                user
            })
        }
    })
});

//POST => save updates in the database
router.post('/users/:user_id', uploadCloud.single('photo'), (req, res, next) => {
    
    User.findById(req.params.user_id, (error, user) => {
        const salt = bcrypt.genSaltSync(bcryptSalt);
        user.name = req.body.name;
        user.email = req.body.email;
        user.password = bcrypt.hashSync(req.body.password, salt);;
        user.type = req.body.type;
        if (req.file) {
            user.imgName = req.file.originalname;
            user.imgPath = req.file.url;
        } 
        
        user.save(error => {
            if (error) {
                next(error);
            } else {
                if (req.body.profile == 'profile') {
                    res.redirect(`/profile/${user._id}`);
                } else {
                    res.redirect(`/users`);
                }
            }
        })

    })
});

//DELETE => remove the user from DB
router.get('/users/:user_id/delete', (req, res, next) => {
    User.remove({
        _id: req.params.user_id
    }, error => {
        if (error) {
            next(error);
        } else {
            if (req.body.profile == 'profile') {
                res.redirect(`/`);
            } else {
                res.redirect(`/users`);
            }
        }
    })
});
//GET => Profile User
router.get('/profile/:user_id', (req, res, next) => {
    User.findById(req.params.user_id, (error, user) => {
        if (error) {
            next(error);
        } else {
            res.render('user/profile', {
                user
            })
        }
    })
});



//GET => render rooms
router.get('/rooms', (req, res, next) => {
    Room.find({}, (error, roomsFromDB) => {
        
        if (error) {
            next(error);
        } else {
            roomsFromDB.forEach(room => {
                if(req.user && (room.owner.equals(req.user._id) || req.user.type == 'admin')){
                    room.owned = true;
                }
                
            })
            res.render('room/rooms', {
                rooms: roomsFromDB
            })
        }
    })
});
//GET => render add new room
router.get('/rooms/new', (req, res, next) => {
    res.render('room/new');
});
//POST => create a new room to db
router.post('/rooms', uploadCloud.single('photo'), (req, res, next) => {
    if(!req.user){
        res.redirect('/login')
    }else{
    const newRoom = new Room({
        name: req.body.name,
        description: req.body.description,
        owner: req.user,
        imgName: req.file ? req.file.originalname : 'default',
        imgPath: req.file && req.file.url
    });

    newRoom.save(error => {
        if (error) {
            next(error);
        } else {
            res.redirect('/rooms')
        }
    })
}
});

//GET => get the form pre-filled with the details of one room
router.get('/rooms/:room_id/edit', (req, res, next) => {
    Room.findById(req.params.room_id, (error, room) => {
        if (error) {
            next(error);
        } else {
            if(req.user && (room.owner.equals(req.user._id) || req.user.type == 'admin')){
                res.render('room/edit', {
                    room
                });
            }else{
                res.redirect('/rooms')
            }
        }
    })
});

//POST => save updates in the database
router.post('/rooms/:room_id', uploadCloud.single('photo'), (req, res, next) => {
    Room.findById(req.params.room_id, (error, room) => {
        room.name = req.body.name;
        room.description = req.body.description;
        room.imgName = req.file ? req.file.originalname : room.imgName;
        room.imgPath = req.file ? req.file.url : room.imgPath;
        room.save(error => {
            if (error) {
                next(error);
            } else {
                res.redirect(`/rooms`);
            }
        })

    })
});

//GET => rooms detail
router.get('/rooms/:id/detail', (req, res, next) => {
    Room.findOne({_id: req.params.id})
    .populate({path: 'reviews', populate: {path: 'user'}})
    .then(room => {
        res.render('room/detail', {room})
    })
    .catch(error => {
        console.log(error);
    })    

    
});

//DELETE => remove the room from DB
router.get('/rooms/:room_id/delete', (req, res, next) => {
    Room.remove({
        _id: req.params.room_id
    }, error => {
        if (error) {
            next(error);
        } else {
            res.redirect('/rooms')
        }
    })
});

//POST => create a review
router.post('/reviews', (req, res, next) => {
    if(!req.user){
        res.redirect('/login');
    }else{
    const roomId = req.body.room_id;
    const {comment, rating} = req.body;
    const newReview = new Review({
        comment, rating, user: req.user
    });
    newReview.save()
    .then(review => {
        Room.update(
            {_id: roomId},
            {$push: {reviews: review._id}},
            {new: true}
        ).then(room => {
            res.redirect(`/rooms/${roomId}/detail`, )
        }).
        catch(err => {
            throw new Error(err);
        })
    })
    .catch(err => {
        throw new Error(err);
    })
}

})

module.exports = router;

