
const express = require('express');
const router  = express.Router();
let Babysitter = require('../models/babysitter');


router.get('/babysitter/:id', function(req, res) {
  Babysitter.findOne({_id: req.params.id}, function(err, baby) {
    if (err) {
      console.log(err);
    } else {
      res.render('babysitter',
      {baby: baby});
    }
  });
})

module.exports = router;