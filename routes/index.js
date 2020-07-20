const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res) => {
    try {
        res.cookie('name', 'name')
        res.render('index', {
            title: 'BabySteps',
            success: req.session.success,
            errors: req.session.errors,
            layout: false
        });
        req.session.errors = null;
    } catch (error) {
        console.log(error);
    }
});

//cookie router
router.get('/cookies', (req, res) => {
    res.render('cookie-policy.hbs')
});


module.exports = router;