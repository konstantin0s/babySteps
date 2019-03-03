
const express = require('express');
const router  = express.Router();
let Parent = require('../models/parent');


router.get('/parentProfile/:id', function(req, res) {
  Parent.findOne({_id: req.params.id}, function(err, parent) {
    if (err) {
      console.log(err);
    } else {
      res.render('parentProfile',
      {parent: parent});
    }
  });
})


module.exports = router;