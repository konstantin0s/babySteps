const express = require('express');
const router = express.Router();
const Parents = require('../models/parent');

router.get('/parents', (req, res) => {
    try {
        if (req.session.family) {
            res.status(403).send("Go away");
            res.redirect('/babysitters');
        }
        Parents.find({}, (err, parents) => {
            if (err) {
                console.log(err);
            } else {
                // debugger
                res.render('parents', { parents: parents, family: req.session.family, sitter: req.session.currentUser, layout: false });
            }
        });
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;