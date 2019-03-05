
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

router.get('/photo/add', function(req, res) {
  res.render('/babysitter');
  });

   //add submit POST route
   router.post('/photo/add', function(req, res) {

    let profilePhoto = new Babysitter();
        profilePhoto.image = req.body.image;
        profilePhoto.save(function(err, profilePhoto) {
         if (err) {
           console.log(err);
           return;
         } else {
           res.redirect('/babysitter',
           {profilePhoto});
         }
    });
   });

module.exports = router;