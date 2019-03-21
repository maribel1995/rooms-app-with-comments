const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Room = require('../models/room');
const Review = require('../models/review');
const uploadCloud = require('../config/cloudinary.js');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const nodemailer = require('nodemailer');
const templates = require('../templates/template.js')

//Nodemailer
let transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
        user: process.env.MAILUSER,
        pass: process.env.MAILPW
    }
});


isAdmin = (user) => user && user.type == 'admin';

isOwner = (user, room) => user && (room.owner.equals(user._id));


//GET => render home
router.get('/', (req, res, next) => {
    var accountSid = 'AC47de170971bd1478de7edcd06ee469c9'; // Your Account SID from www.twilio.com/console
    var authToken = 'b9781e612fbc19513ba1fa8cfd0da087';   // Your Auth Token from www.twilio.com/console

    var twilio = require('twilio');
    var client = new twilio(accountSid, authToken);
    client.messages
        .create({
            body: 'Hello there!',
            from: 'whatsapp:+14155238886',
            to: 'whatsapp:+5511972616068'
        })
        .then(message => console.log(message.sid))
        
        .catch(error => console.log(error));
    res.render('index');

});

//GET => render add new user
router.get('/users/new', (req, res, next) => {
    res.render('user/new');
});
//GET => render users
router.get('/users', (req, res, next) => {
    User.find()
        .then(users => {
            if (isAdmin(req.user)) {
                res.render('user/users', {
                    users
                })
            } else {
                res.render('not-found');
            }
        })
        .catch(error => {
            throw new Error(error);
        });
});

filtro = (obj) => {
    const keys = Object.keys(obj);
    let str = '';
    if (typeof keys === 'string') {
        str = `${keys}: ${Object.values(obj)} `;
    } else {
        keys.forEach((k, i) => {
            const values = Object.values(obj)[i];
            if (typeof values === 'string') {
                str = str + `${k}: ${values} `
            } else {
                values.forEach(value => {
                    str = str + `${k}: ${value} `;
                })

            }
        });
    }

    return str;
}

//GET => render filter users
router.get('/filter', (req, res, next) => {
    console.log(req.query)
    User.find(req.query)
        .then(users => {
            res.render('user/filter', {
                users,
                filters: filtro(req.query)
            })

        })
        .catch(error => {
            throw new Error(error);
        });
});


//POST => create a new user to db
router.post('/users', uploadCloud.single('photo'), (req, res, next) => {


    const {
        name,
        email,
        password,
        type,
        hairColor,
        hairType,
        eyeColor,
    } = req.body;

    User.findOne({
        'email': email
    })
        .then(user => {
            if (user !== null) {
                res.render("user/new", {
                    msgError: "E-mail already exists!"
                });
                return;
            }
            const salt = bcrypt.genSaltSync(bcryptSalt);
            const hashPass = bcrypt.hashSync(password, salt);

            const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let token = '';
            for (let i = 0; i < 25; i++) {
                token += characters[Math.floor(Math.random() * characters.length)];
            }

            const newUser = new User({
                name,
                email,
                profileImg: req.file ? req.file.url : 'https://res.cloudinary.com/dxemyxjas/image/upload/v1551523115/rooms-app/profile-no.png',
                password: hashPass,
                type,
                hairColor,
                hairType,
                eyeColor,
                token
            });

            let link = `<a href="http://localhost:3000/confirm/${token}">here</a>`;

            newUser.save()
                .then(user => {
                    //Nodemailer
                    transporter.sendMail({
                        from: '"RoomsWorld 👻" <noreply@roomsworld.com>>',
                        to: email,
                        subject: 'pls, confirm your e-mail - RoomsWorld',
                        html: templates.templateExample(link, req.user.name),
                    })
                        .then(info => res.redirect('/users'))
                        .catch(error => {
                            throw new Error(error)
                        });
                })
                .catch(err => {
                    throw new Error(err)
                })
        })
        .catch(err => {
            throw new Error(err)
        });
});

//GET => confirm e-mail
router.get('/confirm/:token', (req, res) => {
    const {
        token
    } = req.params;

    User.findOneAndUpdate({
        token
    }, {
            $set: {
                status: 'active'
            }
        }, {
            new: true
        })
        .then(user => {
            // if (user.status === 'active') res.status(500).send('user already confirmed');

            (user) ? res.render("user/confirmation", {
                user
            }) : res.status(500).send('user not found');
        })
        .catch(err => {
            throw new Error(err)
        });

});

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
        user.password = bcrypt.hashSync(req.body.password, salt);
        if (req.file) {
            user.profileImg = req.file.url;
        }

        user.save(error => {
            if (error) {
                next(error);
            } else {
                if (req.body.profile == 'profile') {
                    res.redirect(`/profile/${user._id}`);
                } else {
                    res.redirect(`/filter`);
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
                if (isOwner(req.user, room) || isAdmin(req.user)) {
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
    if (!req.user) {
        res.redirect('/login')
    } else {

        const {
            latitude,
            longitude
        } = req.body;

        const location = {
            type: 'Point',
            coordinates: [longitude, latitude]
        };


        const newRoom = new Room({
            name: req.body.name,
            description: req.body.description,
            owner: req.user,
            imgName: req.file && req.file.originalname,
            imgPath: req.file && req.file.url,
            location
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
            if (isOwner(req.user, room) || isAdmin(req.user)) {
                res.render('room/edit', {
                    room
                });
            } else {
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
    Room.findOne({
        _id: req.params.id
    })
        .populate({
            path: 'reviews',
            populate: {
                path: 'user'
            }
        })
        .then(room => {
            res.render('room/detail', {
                room
            })
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
    if (!req.user) {
        res.redirect('/login');
    } else {
        const roomId = req.body.room_id;
        const {
            comment,
            rating
        } = req.body;
        const newReview = new Review({
            comment,
            rating,
            user: req.user
        });
        newReview.save()
            .then(review => {
                Room.update({
                    _id: roomId
                }, {
                        $push: {
                            reviews: review._id
                        }
                    }, {
                        new: true
                    }).then(room => {
                        res.redirect(`/rooms/${roomId}/detail`)
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

//API 
router.get('/api/rooms', (req, res, next) => {
    Room.find()
        .then(rooms => {
            res.status(200).json({
                rooms
            });
        })
        .catch(error => {
            throw new Error(error)
        })
})


module.exports = router;