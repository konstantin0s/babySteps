const express = require('express');
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');
const Babysitter = require('../models/babysitter');
const uploader = require('../models/cloudinary-setup');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


router.get('/babysitter/:id/edit', function(req, res) {
    try {
        Babysitter.findOne({ _id: req.params.id }, function(err, editBaby) {
            if (err) {
                console.log(err);
            } else {
                res.render('edit_babysitter', { editBaby: editBaby, sitter: req.session.sitter, layout: false });
            }
        });
    } catch (error) {
        console.log(error);
    }
});

//findByIdAndUpdate(req.session.user._id, {})
// router.get('/babysitter/edit', function(req, res) {
//     debugger
//     res.render('edit_babysitter', { editBaby: req.session.currentUser, layout: false });
// })

//add submit POST route
router.post('/babysitter/:id/edit', uploader.single('image'), async function(req, res) {

    try {
        //in case you don't update image, run this
        if (req.file === undefined) {
            Babysitter.findOne({ _id: req.params.id }, async function(err, babysitters) {
                if (err) {
                    console.log(err);
                } else {

                    let babyx = {};
                    babyx.firstName = req.body.firstName;
                    babyx.lastName = req.body.lastName;
                    babyx.username = req.body.username;
                    babyx.city = req.body.city;
                    babyx.country = req.body.country;
                    babyx.image = babysitters.image;
                    babyx.age = req.body.age;
                    babyx.salary = req.body.salary;
                    babyx.phone = req.body.phone;
                    babyx.profession = req.body.profession;
                    babyx.experience = req.body.experience;
                    babyx.language = req.body.language;
                    babyx.availability = req.body.availability;

                    await Babysitter.findByIdAndUpdate({ _id: req.params.id }, babyx, function(err) {
                        if (err) {
                            // req.flash(
                            //     'updateParentErrorMsg',
                            //     'Something went wrong while updating your profile!'
                            // );
                            console.log(err);
                            return;
                        } else {
                            console.log(babyx);
                            // req.flash(
                            //     'updateParentSuccessMsg',
                            //     'Profile updated successfully!'
                            // );
                            res.redirect(`/babysitter/${req.params.id}`);
                        }
                    }).catch((error) => {
                        next(error);
                    });
                }
            }).catch((error) => {
                next(error);
            });
        } else {
            //in case you update image, run this:
            let babys = {};
            babys.firstName = req.body.firstName;
            babys.lastName = req.body.lastName;
            babys.username = req.body.username;
            babys.city = req.body.city;
            babys.country = req.body.country;
            babys.image = req.file.path;
            babys.age = req.body.age;
            babys.salary = req.body.salary;
            babys.phone = req.body.phone;
            babys.profession = req.body.profession;
            babys.experience = req.body.experience;
            babys.language = req.body.language;
            babys.availability = req.body.availability;


            await Babysitter.findByIdAndUpdate({ _id: req.params.id }, babys, function(err) {
                if (err) {
                    // req.flash(
                    //     'updateParentErrorMsg',
                    //     'Something went wrong while updating your profile!'
                    // );
                    return;
                } else {
                    console.log(babys);
                    // req.flash('updateParentSuccessMsg', 'Profile updated successfully!');
                    res.redirect(`/babysitter/${req.params.id}`);
                }
            }).catch((error) => {
                next(error);
            });
        }

    } catch (error) {
        console.log(error);
    }

});

module.exports = router;