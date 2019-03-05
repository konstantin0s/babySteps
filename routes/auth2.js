const express = require('express');
const router  = express.Router();
const request = require('request');
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt         = require("bcrypt");
const dotenv = require('dotenv').config();
router.use(cookieParser());

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


const Parent = require("../models/parent");
const Babysitter =  require('../models/babysitter');
const bcryptSalt     = 10;

// Parent area
router.get("/parent/signup", (req, res, next) => {
  res.render("auth/parent/signup");
});

router.post("/parent/signup", (req, res, next) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const username = req.body.username;
  const password = req.body.password;
  const city = req.body.city;
  const country = req.body.country;
  const kids = req.body.kids;
  const days = req.body.days;
  const image = req.body.image;


  if (username == "" || password == "") {
    res.render("auth/parent/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  Parent.findOne({"username": username})
  .then(user => {
    if (user !== null) {
      res.render("auth/parent/signup", {
        errorMessage: "The username already exists!"
      });
      return;
    }


  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  Parent.create({
    firstName,
    lastName,
    username,
    password: hashPass,
    city,
    country,
    kids,
    days,
    image
  })
  .then(() => {
    res.redirect("login");
  })
})
  .catch(error => {
    next(error);
  })
});

router.post('/parent/signup', function(req, res) {
  
  if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null)
  {
    return res.json({"responseError" : "Please select captcha first"});
  }

  const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + process.env.SECRET_KEY + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

  request(verificationURL,function(error,response,body) {
    body = JSON.parse(body);

    if(body.success !== undefined && !body.success) {
      return res.json({"responseError" : "Failed captcha verification"});
    }
    res.json({"responseSuccess" : "Sucess"});
  });
});

 router.get("/parent/login", (req, res, next) => {
   debugger
  res.render("auth/parent/login");
});

router.post("/parent/login", (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;
  debugger
  if (theUsername === "" || thePassword === "") {
    res.render("auth/parent/login", {
      errorMessage: "Please enter both, username and password to sign up."
    });
    return;
  }
  //if parent Parent.findOne else Sitter.findOne

  Parent.findOne({ "username": theUsername })
  .then(user => {
      if (!user) {
        debugger
        res.render("auth/parent/login", {
          errorMessage: "The username doesn't exist."
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.password)) {
        // Save the login in the session!
        debugger
        req.session.currentUser = user;
        // res.locals.parent = true;
        res.locals.parent = req.parent;
        res.redirect("/babysitters");
      } else {
        res.render("auth/parent/login", {
          errorMessage: "Incorrect password"
        });
      }
  })
  .catch(error => {
    next(error);
  })
});

router.get("/logout", (req, res, next) => {
  res.clearCookie("name");
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/");
  });
});


module.exports = router;