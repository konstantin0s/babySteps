
const express = require('express');
const router  = express.Router();
let Parent = require('../models/parent');


// router.get('/parent/', function(req, res) {
//   // res.render('edit_parent', {editParent: req.session.currentUser});
//   // if(req.session.family) {
//     // res.status(403).send("Go away");
//     // res.redirect('/babysitters');
//     // return
//   // }
//   Parent.findOne({_id: req.params.id}, function(err, parent) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.render('parent',
//       {parent: parent, family:req.session.currentUser, sitter:req.session.currentUser});
//     }
//   });
// })

router.get('/parent/:id', function(req, res) {
  Parent.findOne({_id: req.params.id}, function(err, parent) {
    if (err) {
      console.log(err);
    } else {
      res.render('parent',
      {parent: parent, family:req.session.currentUser, sitter:req.session.currentUser});
      // debugger;
    }
  });
})


module.exports = router;