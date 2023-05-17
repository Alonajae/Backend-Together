var express = require('express');
var router = express.Router();
const SafePlace = require('../models/safeplaces');
const { log } = require('console');

// Get all the safeplaces

router.get('/', function (req, res, next) {
    SafePlace.find()
        .then((data) => {
            console.log(data);
            res.json({ result: true, safeplaces: data });
        })
        .catch((error) => {
            res.json({ result: false, error: error.message });
        });
});

// Add a new safeplace

router.post('/add', function (req, res, next) {
    // SafePlace.findOne({ address: req.body.address }).then((data) => {
    //     if (data === null) {
    const newSafePlace = new SafePlace({
        address: req.body.address,
        coordinate: {
            latitude: req.body.coordinate.latitude,
            longitude: req.body.coordinate.longitude,
        },
        hours: req.body.hours,
        phone: req.body.phone,
    });
    newSafePlace.save()
        .then((data) => {
            res.json({ result: true, safeplace: data });
        })
        .catch((error) => {
            res.json({ result: false, error: error.message });
        });     
// }})
})



module.exports = router;
