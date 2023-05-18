var express = require('express');
var router = express.Router();
const ObjectId = require('mongoose').Types.ObjectId;
const User = require('../models/users');
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
    const alertInfo = req.body;
    // Check if the user exists
    User.findOne({ token: alertInfo.token })
        .then((data) => {
            if (!data) {
                res.json({ result: false, error: 'User not found' });
            } else {
                // If the user exists, create a new alert
                const newAlert = new Alert({
                    user: ObjectId(data._id),
                    coordinate: alertInfo.coordinate,
                    date: new Date(),
                    type: alertInfo.type,
                    description: alertInfo.description,
                });
                newAlert.save()
                Alert.findOne({user: ObjectId(data._id)})
                    .populate('user')
                    .then((infos) => {
                        const response = {
                            coordinate: infos.coordinate,
                            date: moment(infos.date).format('MMMM Do YYYY, h:mm:ss a'),
                            type: infos.type,
                            description: infos.description,
                            user: infos.user.firstname,
                        }
                        res.json({ result: true, alert: response });
                    })
                    .catch((error) => {
                        res.json({ result: false, error: error.message });
                    });
            }
        })
        .catch((error) => {
            res.json({ result: false, error: error.message });
        });
});

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
