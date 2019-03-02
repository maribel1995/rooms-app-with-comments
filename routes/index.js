const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Room = require('../models/room');
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
            res.render('user/users', {
                users: usersFromDB
            })
        }
    })
});
//POST => create a new user to db
router.post('/users', uploadCloud.single('photo'), (req, res, next) => {


    const {
        name,
        email,
        password
    } = req.body;

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const newUser = new User({
        name,
        email,
        imgName: req.file ? req.file.originalname : '',
        imgPath: req.file ? req.file.url : '',
        password: hashPass

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
        user.name = req.body.name;
        user.email = req.body.email;
        user.password = req.body.password;
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
//POST => create a new user to db
router.post('/rooms', uploadCloud.single('photo'), (req, res, next) => {
    const newRoom = new Room({
        name: req.body.name,
        description: req.body.description,
        //owner: req.body.owner,
        imgName: req.file.originalname,
        imgPath: req.file.url
    });

    newRoom.save(error => {
        if (error) {
            next(error);
        } else {
            res.redirect('/rooms')
        }
    })
});

//GET => get the form pre-filled with the details of one room
router.get('/rooms/:room_id/edit', (req, res, next) => {
    Room.findById(req.params.room_id, (error, room) => {
        if (error) {
            next(error);
        } else {
            res.render('room/edit', {
                room
            })
        }
    })
});

//POST => save updates in the database
router.post('/rooms/:room_id', uploadCloud.single('photo'), (req, res, next) => {
    Room.findById(req.params.room_id, (error, room) => {
        room.name = req.body.name;
        room.description = req.body.description,
            room.imgName = req.file.originalname;
        room.imgPath = req.file.url;
        room.save(error => {
            if (error) {
                next(error);
            } else {
                res.redirect(`/rooms`);
            }
        })

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
})

module.exports = router;