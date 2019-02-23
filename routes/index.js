const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Room = require('../models/room');

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
router.post('/users', (req, res, next) => {
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        imageUrl: req.body.imageUrl
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
        if(error){
            next(error);
        }else{
            res.render('user/edit', {user})
        }
    })
});

//POST => save updates in the database
router.post('/users/:user_id', (req, res, next) => {
    User.findById(req.params.user_id, (error, user) => {
        user.name = req.body.name;
        user.email = req.body.email;
        user.password = req.body.password;
        user.imageUrl = req.body.imageUrl;
        user.save(error => {
            if (error) {
                next(error);
            } else {
                res.redirect(`/users`);
            }
        })
        
    })
})

//DELETE => remove the user from DB
router.get('/users/:user_id/delete', (req, res, next) => {
    User.remove({_id: req.params.user_id}, error => {
        if(error){
            next(error);
        }else{
            res.redirect('/users')
        }
    })
})



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
router.post('/rooms', (req, res, next) => {
    const newRoom = new Room({
        name: req.body.name,
        description: req.body.description,
        //owner: req.body.owner,
        imageUrl: req.body.imageUrl
    });

    newRoom.save(error => {
        if (error) {
            next(error);
        } else {
            res.redirect('/rooms')
        }
    })
});

module.exports = router;