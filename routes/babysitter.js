
const express = require('express');
const router  = express.Router();
let Babysitter = require('../models/babysitter');


router.get('/babysitter/:id', function(req, res) {
  Babysitter.findOne({_id: req.params.id}, function(err, baby) {
    if (err) {
      console.log(err);
    } else {
      res.render('babysitter',
      {baby: baby, family:req.session.family, sitter:req.session.sitter});
    }
  });
})

router.post('/babysitter', (req, res, next) => {
  const { user, comments } = req.body;
  Babysitter.updateOne({ _id: req.query.babysitter_id }, { $push: { reviews: { user, comments }}})
  .then(babysitter => {
    res.redirect('/babysitter/' + req.query.babysitter_id)
  })
  .catch((error) => {
    console.log(error)
  })
})

router.get('/photo/add', function(req, res) {
  res.render('/babysitter', {family:req.session.family, sitter:req.session.sitter});
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