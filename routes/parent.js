
const express = require('express');
const router  = express.Router();
let Parent = require('../models/parent');


router.get('/parent/:id', function(req, res) {
  // if(req.session.family) {
    // res.status(403).send("Go away");
    // res.redirect('/babysitters');
    // return
  // }
  Parent.findOne({_id: req.params.id}, function(err, parent) {
    if (err) {
      console.log(err);
    } else {
      res.render('parent',
      {parent: parent, family:req.session.family, sitter:req.session.sitter});
    }
  });
})


module.exports = router;