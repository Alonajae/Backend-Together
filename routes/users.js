var express = require('express');
var router = express.Router();
const User = require('../models/users');
const Trip = require('../models/trips');

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



module.exports = router;
