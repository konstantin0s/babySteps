const express = require('express');
const router  = express.Router();
const path         = require('path');
const bodyParser   = require('body-parser');
let Parent = require('../models/parent');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


//findByIdAndUpdate(req.session.user._id, {})
 router.get('/parent/edit' , function(req, res) {
    debugger
  res.render('edit_parent', {editParent: req.session.currentUser});
 })
  
     //add submit POST route
     router.post('/parent/edit', function(req, res) {
  
      let pare = {};
      pare.firstName = req.body.firstName;
      pare.lastName = req.body.lastName;
      pare.username = req.body.username;
      pare.password = req.body.password;
      pare.city = req.body.city;
      pare.country = req.body.country;
      pare.image = req.body.image;
      pare.kids = req.body.kids;
      pare.days = req.body.days;

      let query = {_id: req.params.id}
   
      Parent.findByIdAndUpdate(req.session.currentUser._id, pare, function(err) { 
           if (err) {
             console.log(err);
             return;
           } else {
             res.redirect('/babysitters');
           }
      });
     });



     

     module.exports = router;