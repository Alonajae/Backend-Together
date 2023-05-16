var express = require('express');
var router = express.Router();
const User = require('../models/users');
const Trip = require('../models/trips');
const cloudinary = require('cloudinary').v2;
const uniqid = require('uniqid');
const fs = require('fs');
const bcrypt = require('bcrypt');

// Get all the trips of a user

router.post('/trips/:token', function (req, res, next) {
    const token = req.params.token;
    User.findOne({ token: token })
        .then((data) => {
            if (data) {
                Trip.find({ user: data._id })
                    .populate('user')
                    .then((trips) => {
                        res.json({ result: true, trips: trips });
                    })
            }
        })
})

// Modify profile section of a user !!

// Modify the profile picture of a user
router.post('/upload', async (req, res) => {
    // Get the photo from the request
    try {
        const photoPath = `./tmp/${uniqid()}.jpg`;
        const resultMove = await req.files.photoFromFront.mv(photoPath);

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
    if (infos.email && infos.emergencyContact) {
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

// Modify the password of a user

// Delete a user

// Get all the users

// Get all the users visible on map (for the map) & close to the user

// Modify the location of a user

// Get all the messages of a user for a specific trip





module.exports = router;
