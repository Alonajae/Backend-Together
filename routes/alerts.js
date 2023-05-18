var express = require('express');
var router = express.Router();
const Alert = require('../models/alerts');
const moment = require('moment');

// Get all the alerts

router.get('/', function (req, res, next) {
    Alert.find()
        .populate('user') // Populate the user field of the alert with the user data
        .then((data) => {
            // Convert the date to a readable format, and create a good looking object to send back to the client
            const alertsInfos = data.map((alert) => {
                return {
                    coordinate: alert.coordinate,
                    date: moment(alert.date).format('MMMM Do YYYY, h:mm:ss a'),
                    type: alert.type,
                    description: alert.description,
                    user: alert.user.firstname,
                }
            })
            res.json({ result: true, alerts: alertsInfos });
        })
        .catch((error) => {
            res.json({ result: false, error: error.message });  
        });
});


// Add a new alert
router.post('/add', function (req, res, next) {
    const newAlert = new Alert({
        user: ObjectId(req.body.userId),
        coordinate: req.body.coordinate,
        date: new Date(),
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

// Delete an alert every 24 hours

router.delete('/delete', function (req, res, next) {
    Alert.deleteMany({ date: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } })
        .then((data) => {
            res.json({ result: true, alerts: data });
        })
        .catch((error) => {
            res.json({ result: false, error: error.message });
        });
})



module.exports = router;
