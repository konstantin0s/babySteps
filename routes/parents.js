const express = require('express');
const router  = express.Router();
const Parents = require('../models/parent');

router.get('/parents', (req, res, next) => {
  Parents.find({}, (err, parents) => {
    if (err) {
      console.log(err);
    } else {
      let navbar;
     
      debugger
      res.render('parents',
      {parents: parents, family:req.session.family, sitter:req.session.sitter});
    }
    
  });
});



module.exports = router;