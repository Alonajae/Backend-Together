var express = require('express');
var router = express.Router();
const Trip = require('../models/trips');
const User = require('../models/users');
const fetch = require('node-fetch');

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
    const mode = req.body.mode || 'walking';

    const origin = from.latitude + ',' + from.longitude;
    const destination = to.latitude + ',' + to.longitude;

    const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=${mode}&key=${process.env.GOOGLE_API_KEY}`;

    // Perform directions request using the coordinates
    fetch(directionsUrl)
        .then(response => response.json())
        .then(data => {
            // Process the directions response here
            res.json({ result: true, data: data });
        })
        .catch(error => {
            console.error('Error:', error);
        });

})

// Create the second part of the trip

router.post('/findBuddy', function (req, res, next) {
    const token = req.body.token;
    const itinerary = req.body.itinerary.points.map((point) => {
        return point.latitude.toFixed(4) + ',' + point.longitude.toFixed(4);
    });
    User.findOneAndUpdate({ token: token }, { isSearching: true, itinerary: itinerary })
        .then((data) => {
            if (data) {
                User.find({ isSearching: true })
                    .then((users) => {
                        const onlyOthers = users.filter((user) => {
                            return user.token !== token;
                        })
                        const buddies = onlyOthers.map((user) => {
                            let similarity = 0;
                            itinerary.forEach((step) => {
                                if (user.itinerary.includes(step)) {
                                    similarity++;
                                }
                            })
                            let similarityPercentage = similarity / itinerary.length;
                            let similarityPercentageRounded = Math.round(similarityPercentage * 100);
                            let newUser = {
                                token: user.token,
                                firstname: user.firstname,
                                lastname: user.lastname,
                                email: user.email,
                                currentLocation: user.currentLocation,
                                profilePicture: user.profilePicture,
                                age: user.age,
                                reasons: user.reasons,
                                itinerary: user.itinerary,
                            };
                            return { user: newUser, similarity: similarityPercentageRounded };
                        })
                        res.json({ result: true, buddies: buddies });
                    })
            } else {
                res.json({ result: false, error: 'Something went wrong' });
            }
        })
})

// Create the third part of the trip

router.post('/relationBuddy', function (req, res, next) {
    const token = req.body.token;
    User.findOneAndUpdate({ token: token }, { isSearching: false, itinerary: [] })
        .then((data) => {
            if (data) {
                res.json({ result: true, data: data });
            } else {
                res.json({ result: false, error: 'Something went wrong' });
            }
        })
})

// Create the fourth part of the trip

// router.post('/sharedtrip', function (req, res, next) {
//     const token = req.body.token;
//     const buddyToken = req.body.buddyToken;
//     const from = req.body.currentPosition; // {latitude: ..., longitude: ...}
//     const to = req.body.address; // {latitude: ..., longitude: ...}
//     const mode = req.body.mode || 'walking';

//     const origin = from.latitude + ',' + from.longitude;
//     const destination = to.latitude + ',' + to.longitude;

//     const waypoints = req.body.itinerary.points.map((point) => {
//         return point.latitude.toFixed(4) + ',' + point.longitude.toFixed(4);
//     });

//     const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=${mode}&key=${process.env.GOOGLE_API_KEY}`;

//     // Perform directions request using the coordinates
//     fetch(directionsUrl)
//         .then(response => response.json())








module.exports = router;
