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

const Babysitter =  require('../models/babysitter');
const bcryptSalt     = 10;


//Babysitter area.

router.get("/sitter/signup", (req, res, next) => {
  res.render("auth/sitter/signup");
});

// BCrypt to encrypt passwords


router.post("/sitter/signup", (req, res, next) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const username = req.body.username;
  const password = req.body.password;
  const city = req.body.city;
  const country = req.body.country;
  const age = req.body.age;
  const salary = req.body.salary;
  const image = req.body.image;


  if (username == "" || password == "") {
    res.render("auth/sitter/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  Babysitter.findOne({"username": username})
  .then(user => {
    if (user !== null) {
      res.render("auth/sitter/signup", {
        errorMessage: "The username already exists!"
      });
      return;
    }


  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  Babysitter.create({
    firstName,
    lastName,
    username,
    password: hashPass,
    city,
    country,
    age,
    salary,
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

router.post('/sitter/signup', function(req, res) {
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

 router.get("/sitter/login", (req, res, next) => {
  res.render("auth/sitter/login");
});

router.post("/sitter/login", (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if (theUsername === "" || thePassword === "") {
    res.render("auth/sitter/login", {
      errorMessage: "Please enter both, username and password to sign up."
    });
    return;
  }

  Babysitter.findOne({ "username": theUsername })
  .then(user => {
      if (!user) {
        res.render("auth/sitter/login", {
          errorMessage: "The username doesn't exist."
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.password)) {
        req.session.currentUser = user;
        req.session.sitter = true;
        res.redirect("/parents");
      } else {
        res.render("auth/sitter/login", {
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