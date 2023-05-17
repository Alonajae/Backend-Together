var express = require('express');
var router = express.Router();
const Alert = require('../models/alerts');

// Get all the alerts

router.get('/', function (req, res, next) {
    SafePlace.find()
        .then((data) => {
            res.json({ result: true, safeplaces: data });
        })
        .catch((error) => {
            res.json({ result: false, error: error.message });
        });
});

// Add a new alert

router.post('/add', function (req, res, next) {
    SafePlace.findOne({ address: req.body.address }).then((data) => {
        if (data) {
            res.json({ result: false, error: 'This safeplace already exists' });
        } else {
    const newSafePlace = new SafePlace({
        address: req.body.address,
        coordinate: {
            latitude: req.body.latitude,
            longitude: req.body.longitude,
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
}})})



module.exports = router;
