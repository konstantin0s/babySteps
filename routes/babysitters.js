const express = require('express');
const router  = express.Router();
let Babysitters =  require('../models/babysitter');


/* GET babysitters page */

router.get('/babysitters', (req, res, next) => {
  Babysitters.find({}, (err, babysitters) => {
    if (err) {
      console.log(err);
    } else {
      res.render('babysitters', 
      {babysitters: babysitters});
    }
    
  });
});

module.exports = router;
