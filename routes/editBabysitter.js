const express = require('express');
const router  = express.Router();
const path         = require('path');
const bodyParser   = require('body-parser');
let Babysitter = require('../models/babysitter');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


//findByIdAndUpdate(req.session.user._id, {})
 router.get('/babysitter/edit' , function(req, res) {
    debugger
  res.render('edit_babysitter', {editBaby: req.session.currentUser});
 })
  
     //add submit POST route
     router.post('/babysitter/edit', function(req, res) {
  
      let babys = {};
      babys.firstName = req.body.firstName;
      babys.lastName = req.body.lastName;
      babys.username = req.body.username;
      babys.password = req.body.password;
      babys.city = req.body.city;
      babys.country = req.body.country;
      babys.image = req.body.image;
      babys.age = req.body.age;
      babys.salary = req.body.salary;
      babys.profession = req.body.profession;
      babys.experience = req.body.experience;

      let query = {_id: req.params.id}
   
      Babysitter.findByIdAndUpdate(req.session.currentUser._id, babys, function(err) { 
           if (err) {
             console.log(err);
             return;
           } else {
             res.redirect('/babysitters');
           }
      });
     });
     module.exports = router;