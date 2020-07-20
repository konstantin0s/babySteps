const express = require('express');
const router = express.Router();
const Babysitters = require('../models/babysitter');



/* GET babysitters page */

router.get('/babysitters', (req, res) => {
    try {
        Babysitters.find({}, (err, babysitters) => {
            if (err) {
                console.log(err);
            } else {
                res.render('babysitters', { babysitters: babysitters, family: req.session.currentUser, sitter: req.session.sitter, layout: false });
            }
        });
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;