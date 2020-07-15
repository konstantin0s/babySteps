const express = require('express');
const router = express.Router();
let Parent = require('../models/parent');


router.get('/parent/:id', function(req, res) {
    Parent.findOne({ _id: req.params.id }, function(err, parent) {
        if (err) {
            console.log(err);
        } else {
            res.render('parent', { parent: parent, family: req.session.family, sitter: req.session.sitter, layout: false });
            // debugger;
            // console.log('parent', parent);
        }
    });
})


module.exports = router;