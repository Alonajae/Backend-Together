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
          res.json({ result: true, user: { email: user.email, token: token, firstName: data.firstName, lastName: data.lastName, inscriptionDate: data.inscriptionDate, genre: data.genre, profilePicture: data.profilePicture } });
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
        });
        newUser.save()
        res.json({ result: true, user: { email: user.email, token: token, firstName: user.firstName, lastName: user.lastName, inscriptionDate: newUser.inscriptionDate, genre: user.genre, profilePicture: user.profilePicture } });
      } else {
        res.json({ result: false, error: 'User already exists' });
      }
    })
});


module.exports = router;
