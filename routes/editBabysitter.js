const express = require('express');
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');
const Babysitter = require('../models/babysitter');
const Parent = require('../models/parent');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


router.get('/babysitter/:id/edit', function(req, res) {
    Babysitter.findOne({ _id: req.params.id }, function(err, editBaby) {

        if (err) {
            console.log(err);
        } else {
            res.render('edit_babysitter', { editBaby: editBaby, layout: false });
        }

    });
});
//findByIdAndUpdate(req.session.user._id, {})
// router.get('/babysitter/edit', function(req, res) {
//     debugger
//     res.render('edit_babysitter', { editBaby: req.session.currentUser, layout: false });
// })

//add submit POST route
router.post('/babysitter/:id/edit', function(req, res) {

    let babys = {};
    babys.firstName = req.body.firstName;
    babys.lastName = req.body.lastName;
    babys.username = req.body.username;
    // babys.password = req.body.password;
    babys.city = req.body.city;
    babys.country = req.body.country;
    babys.image = req.body.image;
    babys.age = req.body.age;
    babys.salary = req.body.salary;
    babys.profession = req.body.profession;
    babys.experience = req.body.experience;

    let query = { _id: req.params.id }

    Babysitter.findOneAndUpdate(req.params.id, babys, function(err) {
        if (err) {
            console.log(err);
            return;
        } else {
            res.redirect('/babysitters', { layout: false });
        }
    });

});

module.exports = router;