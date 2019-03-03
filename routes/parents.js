const express = require('express');
const router  = express.Router();
let Parents = require('../models/parent');


/* GET Parents page */
const parent = require('../routes/parent');
router.use('/', parent);

router.get('/parents', (req, res, next) => {
  Parents.find({}, (err, parents) => {
    if (err) {
      console.log(err);
    } else {
      res.render('parents',
      {parents: parents});
    }
    
  });
});



module.exports = router;