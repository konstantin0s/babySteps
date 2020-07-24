const express = require('express');
const router = express.Router();
let Parent = require('../models/parent');


router.get('/parent/:id', async function(req, res) {
    try {
        await Parent.findOne({ _id: req.params.id }, function(err, parent) {

            if (err) {
                console.log(err);
            } else {
                console.log('family session', req.session.family);
                console.log('sitter session', req.session.sitter);
                res.render('parent', { parent: parent, family: req.session.family, sitter: req.session.sitter, layout: false });
            }

        });
    } catch (error) {
        console.log(error);
    }
})


module.exports = router;