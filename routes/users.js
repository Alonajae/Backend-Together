var express = require('express');
var router = express.Router();
const User = require('../models/users');
const Trip = require('../models/trips');
const cloudinary = require('cloudinary').v2;
const uniqid = require('uniqid');
const fs = require('fs');
const bcrypt = require('bcrypt');

// Modify profile section of a user !!

// Modify the profile picture of a user
router.post('/upload', async (req, res) => {
    // Get the photo from the request
    try {
        const photoPath = `./tmp/${uniqid()}.jpg`;
        const resultMove = await req.files.picture.mv(photoPath);

        if (!resultMove) {
            const resultCloudinary = await cloudinary.uploader.upload(photoPath);
            res.json({ result: true, url: resultCloudinary.secure_url });
        } else {
            res.json({ result: false, error: resultMove });
        }

        fs.unlinkSync(photoPath);
    } catch (error) {
        console.log(error);
        res.json({ result: false, error: error.message });
    }
});

// Modify the infos of a user

router.post('/infos/:token', function (req, res, next) {
    // Get the user from the request
    const token = req.params.token;
    const infos = req.body;
    // Update the user in the database
    if (infos.email && infos.emergencyContact && !infos.password) {
        // If the user wants to modify his email or his emergency contact
        User.findOneAndUpdate({ token: token }, { email: infos.email, emergencyContact: infos.emergencyContact })
            .then((data) => {
                if (data) {
                    res.json({ result: true });
                } else {
                    res.json({ result: false, error: 'Something went wrong' });
                }
            })
    } else if (infos.password) {
        // If the user wants to modify his password
        User.findOne({ token: token })
            .then((data) => {
                if (data) {
                    // If the user exists
                    if (bcrypt.compareSync(infos.password, data.password)) {
                        // If the password is correct
                        const hash = bcrypt.hashSync(infos.newPassword, 10);
                        User.findOneAndUpdate({ token: token }, { password: hash })
                            .then((data) => {
                                if (data) {
                                    res.json({ result: true });
                                } else {
                                    res.json({ result: false, error: 'Something went wrong' });
                                }
                            })
                    } else {
                        // If the password is incorrect
                        res.json({ result: false, error: 'Wrong password' });
                    }
                } else {
                    res.json({ result: false, error: 'Something went wrong' });
                }
            })
    } else {
        res.json({ result: false, error: 'Something went wrong' });
    }

});

// Modify the visibility on map of a user

router.post('/visibleOnMap/:token', function (req, res, next) {
    const token = req.params.token;
    const visibleOnMap = req.body.visibleOnMap;
    User.findOneAndUpdate({ token: token }, { visibleOnMap: visibleOnMap })
        .then((data) => {
            if (data) {
                res.json({ result: true });
            } else {
                res.json({ result: false, error: 'Something went wrong' });
            }
        })
})

// Delete a user

router.delete('/delete/:token', function (req, res, next) {
    const token = req.params.token;
    User.findOneAndDelete({ token: token })
        .then((data) => {
            if (data) {
                res.json({ result: true });
            } else {
                res.json({ result: false, error: 'Something went wrong' });
            }
        })
})


// Get all the users

router.get('/all', function (req, res, next) {
    User.find()
        .then((data) => {
            if (data) {
                res.json({ result: true, users: data });
            } else {
                res.json({ result: false, error: 'Something went wrong' });
            }
        })
})


// Get all the users visible on map

router.get('/buddies', function (req, res, next) {
    User.find({ visibleOnMap: true })
        .then((data) => {
            if (data) {
                // If the fetch is successful
                const usersVisible = data.map((user) => {
                    return {
                        firstname: user.firstname,
                        lastname: user.lastname,
                        email: user.email,
                        currentLocation: user.currentLocation,
                        reasons: user.reasons,
                        age: user.age,
                    }
                })
                res.json({ result: true, users: usersVisible });
            } else {
                res.json({ result: false, error: 'Something went wrong' });
            }
        })
})

// Modify the location of a user

router.post('/location/:token', function (req, res, next) {
    const token = req.params.token;
    const location = req.body.coordinate;
    User.findOneAndUpdate({ token: token }, { currentLocation: location })
        .then((data) => {
            if (data) {
                res.json({ result: true });
            } else {
                res.json({ result: false, error: 'Something went wrong' });
            }
        })
})

// Get all the messages of a user for a specific trip




module.exports = router;
