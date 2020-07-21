const express = require('express');
const router = express.Router();
const request = require('request');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require("bcryptjs");
const dotenv = require('dotenv').config();
const uploader = require('../models/cloudinary-setup');
const path = require('path');

router.use(cookieParser());

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
//Babysitter area.
const Babysitter = require('../models/babysitter');


router.get("/sitter/signup", (req, res) => {
    res.render("auth/sitter/signup", { layout: false });
});

// BCrypt to encrypt passwords
const bcryptSalt = 10;

router.post("/sitter/signup", uploader.single('image'), (req, res, next) => {
    try {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const username = req.body.username;
        const password = req.body.password;
        const city = req.body.city;
        const country = req.body.country;
        const age = req.body.age;
        const salary = req.body.salary;
        const image = req.file.path;


        if (username === "" || password === "" || username.length < 3 || password.length < 3) {
            res.render("auth/sitter/signup", {
                layout: false,
                errorMessage: "You username or the password requires attention!"
            });
            return;
        }

        Babysitter.findOne({ "username": username })
            .then(user => {
                if (user !== null) {
                    res.render("auth/sitter/signup", {
                        layout: false,
                        errorMessage: `The username ${username} already exists!`
                    });
                    return;
                }


                const salt = bcrypt.genSaltSync(bcryptSalt);
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
    } catch (error) {
        console.log(error);
    }
});

router.post('/sitter/signup', function(req, res) {
    try {
        if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
            return res.json({ "responseError": "Please select captcha first" });
        }

        const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + process.env.SECRET_KEY + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

        request(verificationURL, function(error, response, body) {
            body = JSON.parse(body);

            if (body.success !== undefined && !body.success) {
                return res.json({ "responseError": "Failed captcha verification" });
            }
            res.json({ "responseSuccess": "Success" });
        });
    } catch (error) {
        console.log(error);
    }
});

router.get("/sitter/login", (req, res) => {
    res.render("auth/sitter/login", { layout: false });
});

router.post("/sitter/login", (req, res, next) => {
    try {
        const theUsername = req.body.username;
        const thePassword = req.body.password;

        if (theUsername === "" || thePassword === "" || thePassword.length < 3 || theUsername.length < 3) {
            res.render("auth/sitter/login", {
                errorMessage: "Please check both, username and password to log in."
            });
            return;
        }

        Babysitter.findOne({ "username": theUsername })
            .then(user => {
                if (!user) {
                    res.render("auth/sitter/login", {
                        layout: false,
                        errorMessage: `The username > ${theUsername} < doesn't exist.`
                    });
                    return;
                }
                if (bcrypt.compareSync(thePassword, user.password)) {
                    // console.log('sitter user', user);
                    req.session.currentUser = user;
                    req.session.sitter = user;
                    // console.log('this is from auth', req.session.currentUser)
                    res.redirect("/parents");
                } else {
                    res.render("auth/sitter/login", {
                        layout: false,
                        errorMessage: "Incorrect login, try again!"
                    });
                }
                req.session.currentUser = user;
            })
            .catch(error => {
                next(error);
            })
    } catch (error) {
        console.log(error);
    }
});

router.get("/logout", (req, res) => {
    try {
        res.clearCookie("name");
        req.session.destroy((err) => {
            res.redirect("/");
        });
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;