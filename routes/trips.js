var express = require('express');
var router = express.Router();
const Trip = require('../models/trips');
const User = require('../models/users');

// Get all the trips

router.get('/', function (req, res, next) {
    Trip.find()
        .populate('user')
        .then((data) => {
            res.json({ result: true, trips: data });
        })
        .catch((error) => {
            res.json({ result: false, error: error.message });
        });
});

// Get all the trips of a user

router.get('/user/:token', function (req, res, next) {
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

// Create the first part of the trip

router.post('/start', function (req, res, next) {
    const token = req.body.token;
    const from = req.body.currentPosition; // {latitude: ..., longitude: ...}
    const to = req.body.address; // {latitude: ..., longitude: ...}

    const origin = from.latitude + ',' + from.longitude;
    const destination = to.latitude + ',' + to.longitude;

    // Perform directions request using the coordinates
    fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${process.env.GOOGLE_API_KEY}`)
        .then(response => response.json())
        .then(data => {
            // Process the directions response here
            res.json({ result: true, data: data });
        })
        .catch(error => {
            console.error('Error:', error);
        });

})




module.exports = router;
