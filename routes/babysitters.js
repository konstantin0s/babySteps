const express = require('express');
const router  = express.Router();
let Babysitters =  require('../models/babysitter');


/* GET recipes page */

router.get('/babysitters', (req, res, next) => {
  Babysitters.find({}, (err, babysitters) => {
    if (err) {
      console.log(err);
    } else {
      res.render('babysitters',
      {babysitters: babysitters});
    }
    
  });
});

// router.get('/', function(req, res) {
//   // Recipes.find({}, (err, recipes) => {
//   var db = req.db;
//     console.log(req.body);
//     var obj = {}
//     if(req.body.recipes) {
//       console.log(req.body.recipes);
//         obj['recipes'] = req.body.recipes;
//     }
//     db.recipes.find(obj, function(err, docs){
//         if (err) return err;
//         console.log(docs);
//         res.send(docs);
//         // res.send(recipes + ' : ' + source);
//       // });
//     });
//   });

// router.get('/search-result', function(req, res) {
//   Recipes.find({
//     'title': 
//   }, (err, recipe) => {
//   var title = req.query.title;
//   var source = recipe.title;
//   console.log('Searching for: ' + title);
//   console.log('From: ' + source);

//     res.send(title + ':' +  recipe);
//   });
// });


// router.get('/search-result', function(req, res) {
//   var regex = new RegExp(req.query["term"], 'i');
//   var query = Recipes.find({title: regex}, { 'title': 1 }).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
       
//      // Execute query in a callback and return users list
//  query.exec(function(err, recipes) {
//      if (!err) {
//         // Method to construct the json result set
//         var result = buildResultSet(recipes); 
//         res.send(result, {
//            'Content-Type': 'application/json'
//         }, 200);
//      } else {
//         res.send(JSON.stringify(err), {
//            'Content-Type': 'application/json'
//         }, 404);
//      }
//   });
// });


module.exports = router;
