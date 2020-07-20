const express = require('express');
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');
const Parent = require('../models/parent');
const uploader = require('../models/cloudinary-setup');


router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


//findByIdAndUpdate(req.session.user._id, {})
router.get('/parent/:id/edit', function(req, res) {
    try {
        Parent.findById(req.params.id)
            .then(result => {
                res.render('edit_parent', { showParentData: result, editParent: req.session.currentUser, layout: false })
            })
    } catch (error) {
        console.log(error);
    }
})

//add submit POST route
router.post('/parent/:id/edit', uploader.single('image'), async function(req, res) {
    try {
        //in case you don't update image, run this
        if (req.file === undefined) {
            Parent.findOne({ _id: req.params.id }, async function(err, parents) {
                if (err) {
                    console.log(err);
                } else {

                    let parent = {};
                    parent.firstName = req.body.firstName;
                    parent.lastName = req.body.lastName;
                    parent.username = req.body.username;
                    parent.city = req.body.city;
                    parent.country = req.body.country;
                    parent.image = parents.image
                    parent.kids = req.body.kids;
                    parent.days = req.body.days;
                    parent.phone = req.body.phone;

                    await Parent.findByIdAndUpdate({ _id: req.params.id }, parent, function(err) {
                        if (err) {
                            // req.flash(
                            //     'updateParentErrorMsg',
                            //     'Something went wrong while updating your profile!'
                            // );
                            console.log(err);
                            return;
                        } else {
                            console.log(parent);
                            // req.flash(
                            //     'updateParentSuccessMsg',
                            //     'Profile updated successfully!'
                            // );
                            res.redirect(`/parent/${req.params.id}`);
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
            let parent = {};
            parent.firstName = req.body.firstName;
            parent.lastName = req.body.lastName;
            parent.username = req.body.username;
            parent.city = req.body.city;
            parent.country = req.body.country;
            parent.image = req.file.path;
            parent.kids = req.body.kids;
            parent.days = req.body.days;
            parent.phone = req.body.phone;

            await Parent.findByIdAndUpdate({ _id: req.params.id }, parent, function(err) {
                if (err) {
                    // req.flash(
                    //     'updateParentErrorMsg',
                    //     'Something went wrong while updating your profile!'
                    // );
                    return;
                } else {
                    console.log(parent);
                    // req.flash('updateParentSuccessMsg', 'Profile updated successfully!');
                    res.redirect(`/parent/${req.params.id}`, { sitter: req.session.sitter });
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