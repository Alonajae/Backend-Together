var express = require('express');
var router = express.Router();
const Alert = require('../models/alerts');

// Get all the alerts

router.get('/', function (req, res, next) {
    Alert.find()
        .populate('user') // Populate the user field of the alert with the user data
        .then((data) => {
            res.json({ result: true, alerts: data });
        })
        .catch((error) => {
            res.json({ result: false, error: error.message });  
        });
});


// Add a new alert
router.post('/add', function (req, res, next) {
    const newAlert = new Alert({
        user: ObjectId(req.body.userId),
        coordinate: {
            latitude: req.body.coordinate.latitude,
            longitude: req.body.coordinate.longitude,
        },
        date: req.body.date,
        type: req.body.type,
        description: req.body.description,
    });
    newAlert.save()
        .then((data) => {
            res.json({ result: true, alert: data });
        })
        .catch((error) => {
            res.json({ result: false, error: error.message });
        });
})



module.exports = router;
