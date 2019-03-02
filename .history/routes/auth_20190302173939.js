const express = require('express');
const router  = express.Router();
const request = require('request');
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt         = require("bcrypt");
require('dotenv').config()
router.use(cookieParser());

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


const User = require("../models/user");

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});



router.post("/signup", (req, res, next) => {

  const username = req.body.username;
  const password = req.body.password;


  if (username == "" || password == "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({"username": username})
  .then(user => {
    if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The username already exists!"
      });
      return;
    }

  const bcryptSalt     = 10;
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  User.create({
    username,
    password: hashPass
  })
  .then(() => {
    res.redirect("/");
  })
})
  .catch(error => {
    next(error);
  })
});

router.post('/signup', function(req, res) {
  if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null)
  {
    return res.json({"responseError" : "Please select captcha first"});
  }
  // const secretKey = "6LeR0ZMUAAAAANDnXcoQiTvxYDIghn9DZrrf7wFQ";
  process.env.SECRET_KEY

  const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + SECRET_KEY + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

  request(verificationURL,function(error,response,body) {
    body = JSON.parse(body);

    if(body.success !== undefined && !body.success) {
      return res.json({"responseError" : "Failed captcha verification"});
    }
    res.json({"responseSuccess" : "Sucess"});
  });
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if (theUsername === "" || thePassword === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, username and password to sign up."
    });
    return;
  }

  User.findOne({ "username": theUsername })
  .then(user => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist."
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("auth/login", {
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
    res.redirect("/login");
  });
});

module.exports = router;