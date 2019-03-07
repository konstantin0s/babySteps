const express = require('express');
const router  = express.Router();
const path         = require('path');
const bodyParser   = require('body-parser');
const Babysitter = require('../models/babysitter');
const Parent = require('../models/parent');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


router.get('/babysitter/edit/:id', function(req, res, next) {
  Parent.find({}, (err, parents) => {
    if (err) {
      console.log(err);
    } else {
      res.render('edit_babysitter',
      {parents: parents});
    }
  });
 });

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
      // babys.password = req.body.password;
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
             res.redirect('/parents');
           }
      });
     });
     module.exports = router;