var express = require('express');
var router = express.Router();
var User = require('../models/users');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');
const moment = require('moment');

/* GET home page. */

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Singnin */
router.post('/signin', function (req, res, next) {
  // Get the user from the request
  const user = req.body;
  User.findOne({ email: user.email })
    .then((data) => {
      if (!data) {
        // If the user doesn't exist
        res.json({ result: false, error: 'User not found' });
      } else {
        // If the user exists
        if (bcrypt.compareSync(user.password, data.password)) {
          // Create a object to send back to the client, if the password is correct
          const infos = {
            firstname: data.firstname,
            lastname: data.lastname,
            inscriptionDate: moment(data.inscriptionDate).format('L'),
            genre: data.genre,
            profilePicture: data.profilePicture,
            visibleOnMap: data.visibleOnMap,
            emergencyContact: data.urgencyContact,
            email: user.email,
            token: data.token,
          }
          res.json({ result: true, user: infos});
        } else {
          // If the password is wrong
          res.json({ result: false, error: 'Wrong password' });
        }
      }
    })
});

/* Signup */
router.post('/signup', function (req, res, next) {
  // Get the user from the request
  const user = req.body;
  User.findOne({ email: user.email })
    .then((data) => {
      // If the user doesn't exist
      if (!data) {
        const hash = bcrypt.hashSync(user.password, 10);
        const token = uid2(32);
        let emergencyContact;
        if (user.emergencyContact) {
          emergencyContact = user.emergencyContact;
        } else {
          emergencyContact = '17';
        }
        // Create a new user
        const newUser = new User({
          email: user.email,
          password: hash,
          token: token,
          firstname: user.firstname,
          lastname: user.lastname,
          inscriptionDate: new Date(),
          age: user.age,
          genre: user.genre,
          photoId: user.photoId,
          profilePicture: user.profilePicture,
          validationVideo: user.validationVideo,
          visibleOnMap: false,
          emergencyContact: emergencyContact,
        });
        newUser.save()
        // Create a object to send back to the client
        const infos = {
          firstname: user.firstname,
          lastname: user.lastname,
          inscriptionDate: newUser.inscriptionDate,
          genre: user.genre,
          profilePicture: user.profilePicture,
          visibleOnMap: newUser.visibleOnMap,
          emergencyContact: emergencyContact,
          email: user.email,
          token: token,
        }
        res.json({ result: true, user: infos });
      } else {
        // If the user already exists
        res.json({ result: false, error: 'User already exists' });
      }
    })
});

/* Verify if mail exist in database */

router.post('/verify', function (req, res, next) {
  User.findOne({ email: req.body.email })
    .then((data) => {
      if (!data) {
        res.json({ result: true });
      } else {
        res.json({ result: false, message: 'Email already exists' });
      }
    })
});

module.exports = router;
