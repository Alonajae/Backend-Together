var express = require('express');
var router = express.Router();
const User = require('../models/users');
const Trip = require('../models/trips');
const cloudinary = require('cloudinary').v2;
const uniqid = require('uniqid');
const fs = require('fs');
const bcrypt = require('bcrypt');

// Modify profile section of a user !!

// Modify the profile picture of a user
router.post('/upload', async (req, res) => {
    // Get the photo from the request
    try {
        const photoPath = `./tmp/${uniqid()}.jpg`;
        const resultMove = await req.files.picture.mv(photoPath);

        if (!resultMove) {
            const resultCloudinary = await cloudinary.uploader.upload(photoPath);
            console.log(resultCloudinary)
            res.json({ result: true, url: resultCloudinary.secure_url });
        } else {
            res.json({ result: false, error: resultMove });
        }

        fs.unlinkSync(photoPath);
    } catch (error) {
        console.log(error);
        res.json({ result: false, error: error.message });
    }
});


router.post('/uploadVideo', async (req, res) => {
    // Get the video from the user
    try {
        const videoPath = `/tmp/${uniqid()}.mov`;
        console.log('====================================');
        console.log(req.files);
        console.log('====================================');
    
        const resultMoveVideo = await req.files.video.mv(videoPath); // absolument faire le move avant le upload et la suppression. ça bouge d'abord - sinon ne fonctionne pas - en dehors de la condition
        const resultCloudinaryVideo = await cloudinary.uploader.upload(videoPath, {resource_type: "video"});
    
        fs.unlinkSync(videoPath)
        // console.log('====================================');
        // console.log(resultCloudinaryVideo);
        // console.log('====================================');
    
        if(!resultMoveVideo) {
            res.json({result: true, url: resultCloudinaryVideo.secure_url});
        } else {
            res.json({result: false, error: resultMoveVideo})
        }
    } catch (error) {
        console.log(error);
        res.json({result: false, error: error.message})
    }
});

// Modify the infos of a user

router.post('/infos', function (req, res, next) {
    // Get the user from the request
    const infos = req.body;
    // Update the user in the database
    if (infos.email && infos.emergencyContact && !infos.password) {
        // If the user wants to modify his email or his emergency contact
        User.findOneAndUpdate({ token: infos.token }, { email: infos.email, emergencyContact: infos.emergencyContact })
            .then((data) => {
                if (data) {
                    res.json({ result: true });
                } else {
                    res.json({ result: false, error: 'Something went wrong' });
                }
            })
    } else if (infos.password) {
        // If the user wants to modify his password
        User.findOne({ token: infos.token })
            .then((data) => {
                if (data) {
                    // If the user exists
                    if (bcrypt.compareSync(infos.password, data.password)) {
                        // If the password is correct
                        const hash = bcrypt.hashSync(infos.newPassword, 10);
                        User.findOneAndUpdate({ token: infos.token }, { password: hash })
                            .then((data) => {
                                if (data) {
                                    res.json({ result: true });
                                } else {
                                    res.json({ result: false, error: 'Something went wrong' });
                                }
                            })
                    } else {
                        // If the password is incorrect
                        res.json({ result: false, error: 'Wrong password' });
                    }
                } else {
                    res.json({ result: false, error: 'Something went wrong' });
                }
            })
    } else {
        res.json({ result: false, error: 'Something went wrong' });
    }

});

// Modify the visibility on map of a user

router.post('/visibleOnMap', function (req, res, next) {
    const token = req.body.token;
    const visibleOnMap = req.body.visibleOnMap;
    User.findOneAndUpdate({ token: token }, { visibleOnMap: visibleOnMap })
        .then((data) => {
            if (data) {
                res.json({ result: true });
            } else {
                res.json({ result: false, error: 'Something went wrong' });
            }
        })
})

// Delete a user

router.delete('/delete/:token', function (req, res, next) {
    const token = req.params.token;
    User.findOneAndDelete({ token: token })
        .then((data) => {
            if (data) {
                res.json({ result: true });
            } else {
                res.json({ result: false, error: 'Something went wrong' });
            }
        })
})


// Get all the users

router.get('/all', function (req, res, next) {
    User.find()
        .then((data) => {
            if (data) {
                res.json({ result: true, users: data });
            } else {
                res.json({ result: false, error: 'Something went wrong' });
            }
        })
})


// Get all the users visible on map

router.post('/buddies', function (req, res, next) {
    const token = req.body.token;
    User.find({ visibleOnMap: true })
        .then((data) => {
            if (data) {
                const usersWithoutMe = data.filter((user) => {
                    return user.token !== token;
                })
                // If the fetch is successful
                const usersVisible = usersWithoutMe.map((user) => {
                    return {
                        firstname: user.firstname,
                        lastname: user.lastname,
                        email: user.email,
                        currentLocation: user.currentLocation,
                        reasons: user.reasons,
                        age: user.age,
                    }
                })
                res.json({ result: true, users: usersVisible });
            } else {
                res.json({ result: false, error: 'Something went wrong' });
            }
        })
})

// Modify the location of a user

router.post('/location', function (req, res, next) {
    const token = req.body.token;
    const location = req.body.coordinate;
    User.findOneAndUpdate({ token: token }, { currentLocation: location })
        .then((data) => {
            if (data) {
                res.json({ result: true });
            } else {
                res.json({ result: false, error: 'Something went wrong' });
            }
        })
})

// Get the infos of your buddy

router.get('/buddy/:token', function (req, res, next) {
    const token = req.params.token;
    User.findOne({ token: token })
        .then((data) => {
            if (data) {
                // If the fetch is successful
                const userVisible = {
                    firstname: data.firstname,
                    lastname: data.lastname,
                    email: data.email,
                    currentLocation: data.currentLocation,
                    reasons: data.reasons,
                    age: data.age,
                }
                res.json({ result: true, user: userVisible });
            } else {
                res.json({ result: false, error: 'Something went wrong' });
            }
        })
})

// Grant access to app if the validation video is correct

router.post('/grantAccess', function (req, res, next) {
    const token = req.body.token;
    const validationVideo = req.body.validationVideo;
    if(validationVideo){
        User.findOneAndUpdate({token: token}, {validationVideo: validationVideo, accesGranted: true})
        .then((data) => {
            if(data){
                res.json({result: true});
            } else {
                res.json({result: false, error: 'Something went wrong'});
            }
        })
    } else {
        res.json({result: false, error: 'Something went wrong'});
    }
})



module.exports = router;
