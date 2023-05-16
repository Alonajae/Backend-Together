var express = require('express');
var router = express.Router();
const User = require('../models/users');
const Trip = require('../models/trips');
const cloudinary = require('cloudinary').v2;
const uniqid = require('uniqid');
const fs = require('fs');

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

// Modify the emergency contact of a user

// Modify the visibility on map of a user

// Modify the password of a user

// Delete a user

// Get all the users

// Get all the users visible on map (for the map) & close to the user

// Modify the location of a user

// Get all the messages of a user for a specific trip





module.exports = router;
