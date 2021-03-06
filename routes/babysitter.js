const express = require('express');
const router = express.Router();
let Babysitter = require('../models/babysitter');
let Parent = require('../models/parent');


router.get('/babysitter/:id', function(req, res) {
    try {
        Babysitter.findOne({ _id: req.params.id }, function(err, baby) {
            if (err) {
                console.log(err);
            } else {
                res.render('babysitter', {
                    baby: baby,
                    family: req.session.family,
                    sitter: req.session.sitter,
                    layout: false,
                    updateBabySitterErrorMsg: req.flash('updateBabySitterErrorMsg'),
                    updateBabySitterSuccessMsg: req.flash('updateBabySitterSuccessMsg')
                });
            }
        });
    } catch (error) {
        console.log(error);
    }
})

router.post('/babysitter', (req, res) => {
    try {
        const { user, comments } = req.body;
        Babysitter.updateOne({ _id: req.query.babysitter_id }, { $push: { reviews: { user, comments } } })
            .then(babysitter => {
                res.redirect('/babysitter/' + req.query.babysitter_id, {
                    updateBabySitterErrorMsg: req.flash('updateBabySitterErrorMsg'),
                    updateBabySitterSuccessMsg: req.flash('updateBabySitterSuccessMsg')
                })
            })
            .catch((error) => {
                console.log(error)
            });
    } catch (error) {
        console.log(error);
    }
})

router.get('/photo/add', function(req, res) {
    res.render('/babysitter');
});

//add submit POST route
router.post('/photo/add', function(req, res) {

    try {
        let profilePhoto = new Babysitter();
        profilePhoto.image = req.body.image;
        profilePhoto.save(function(err, profilePhoto) {
            if (err) {
                console.log(err);
                return;
            } else {
                res.redirect('/babysitter', {
                    profilePhoto,
                    sitter: req.session.sitter,
                    layout: false
                });
            }
        });
    } catch (error) {
        console.log(error);
    }

});

module.exports = router;