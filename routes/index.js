var express = require('express');
var router = express.Router();
var User = require('../models/users');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Login page. */
router.post('/login', function (req, res, next) {
  const user = req.body;
  User.findOne({ email: user.email })
    .then((data) => {
      if (!data) {
        res.json({ result: false, error: 'User not found' });
      } else {
        if (bcrypt.compareSync(user.password, data.password)) {
          const infos = {
            firstName: data.firstName,
            lastName: data.lastName,
            inscriptionDate: data.inscriptionDate,
            genre: data.genre,
            profilePicture: data.profilePicture,
            visibleOnMap: data.visibleOnMap,
            urgencyContact: data.urgencyContact,
            email: user.email,
            token: data.token,
          }
          res.json({ result: true, user: infos});
        } else {
          res.json({ result: false, error: 'Wrong password' });
        }
      }
    })
});

/* Register page. */

router.post('/register', function (req, res, next) {
  const user = req.body;
  User.findOne({ email: user.email })
    .then((data) => {
      if (!data) {
        const hash = bcrypt.hashSync(user.password, 10);
        const token = uid2(32);
        let urgencyContact;
        if (user.urgencyContact) {
          urgencyContact = user.urgencyContact;
        } else {
          urgencyContact = '17';
        }
        const newUser = new User({
          email: user.email,
          password: hash,
          token: token,
          firstName: user.firstName,
          lastName: user.lastName,
          inscriptionDate: new Date(),
          age: user.age,
          genre: user.genre,
          photoId: user.photoId,
          profilePicture: user.profilePicture,
          validationVideo: user.validationVideo,
          visibleOnMap: false,
          urgencyContact: urgencyContact,
        });
        newUser.save()
        const infos = {
          firstName: user.firstName,
          lastName: user.lastName,
          inscriptionDate: newUser.inscriptionDate,
          genre: user.genre,
          profilePicture: user.profilePicture,
          visibleOnMap: newUser.visibleOnMap,
          urgencyContact: urgencyContact,
          email: user.email,
          token: token,
        }
        res.json({ result: true, user: infos });
      } else {
        res.json({ result: false, error: 'User already exists' });
      }
    })
});


module.exports = router;
