const express = require('express');
const router  = express.Router();
const Parents = require('../models/parent');

router.get('/parents', (req, res, next) => {
  if(req.session.family) {
    res.status(403).send("Go away");
    res.redirect('/babysitters');
    // return
  }
  Parents.find({}, (err, parents) => {
    if (err) {
      console.log(err);
    } else {
      debugger
      res.render('parents',
      {parents: parents, family:req.session.family, sitter:req.session.currentUser});
    }
    
  });
});

module.exports = router;