const express = require('express');
const router  = express.Router();
const Babysitters =  require('../models/babysitter');
const Parent =  require('../models/parent');


/* GET babysitters page */

router.get('/babysitters', (req, res, next) => {
  Babysitters.find({}, (err, babysitters) => {
    if (err) {
      console.log(err);
    } else {
      res.render('babysitters', 
      {babysitters: babysitters, family:req.session.currentUser, sitter:req.session.sitter});
      console.log('family', req.session.currentUser);
      console.log('family', req.session.sitter);
    }
   
  });
});


// router.get('/parents', (req, res, next) => {
//   if(req.session.family) {
//     res.status(403).send("Go away");
//     res.redirect('/babysitters');
//     // return
//   }
//   Parents.find({}, (err, parents) => {
//     if (err) {
//       console.log(err);
//     } else {
//       debugger
//       res.render('parents',
//       {parents: parents, family:req.session.family, sitter:req.session.sitter});
//     }
    
//   });
// });

module.exports = router;
