const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index', {title: 'BabySteps',
 success: req.session.success, errors: req.session.errors 
});
req.session.errors = null;
});

module.exports = router;
