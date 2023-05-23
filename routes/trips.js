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
    const from = req.body.currentPosition;
    const to = req.body.address;
    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(from) + '&key=' + process.env.GOOGLE_MAPS_API_KEY)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'OK' && data.results.length > 0) {
                const originLocation = data.results[0].geometry.location;

                fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(to) + '&key=' + process.env.GOOGLE_MAPS_API_KEY)
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'OK' && data.results.length > 0) {
                            const destinationLocation = data.results[0].geometry.location;

                            // Perform directions request using the obtained coordinates
                            fetch('https://maps.googleapis.com/maps/api/directions/json?origin=' + originLocation.lat + ',' + originLocation.lng + '&destination=' + destinationLocation.lat + ',' + destinationLocation.lng + '&key=' + process.env.GOOGLE_MAPS_API_KEY)
                                .then(response => response.json())
                                .then(data => {
                                    // Process the directions response here
                                    console.log(data);
                                })
                                .catch(error => {
                                    console.error('Error:', error);
                                });
                        } else {
                            console.error('Invalid destination address');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            } else {
                console.error('Invalid origin address');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
})




module.exports = router;
