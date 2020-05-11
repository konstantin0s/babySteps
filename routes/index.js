const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res) => {
  res.render('index', {title: 'BabySteps',
 success: req.session.success, errors: req.session.errors 
});
req.session.errors = null;
});

router.get('/cookies', (req, res) => {
  res.render('cookie-policy.hbs')
})


module.exports = router;
