const express = require('express');
const router = express.Router();
const Babysitters = require('../models/babysitter');
const Parent = require('../models/parent');


/* GET babysitters page */

router.get('/babysitters', (req, res) => {
    Babysitters.find({}, (err, babysitters) => {
        if (err) {
            console.log(err);
        } else {
            res.render('babysitters', { babysitters: babysitters, family: req.session.currentUser, sitter: req.session.sitter, layout: false });
            console.log('family', req.session.currentUser);
            console.log('family', req.session.sitter);
        }

    });
});

module.exports = router;