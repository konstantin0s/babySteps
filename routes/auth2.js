const express = require('express');
const router = express.Router();
const request = require('request');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require("bcryptjs");
const uploader = require('../models/cloudinary-setup');
const path = require('path');
const dotenv = require('dotenv').config();
router.use(cookieParser());

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


const Parent = require("../models/parent");
const Token = require('../models/parentToken');

const bcryptSalt = 10;

// Parent area
router.get("/parent/signup", (req, res) => {
    res.render("auth/parent/signup", { layout: false });
});

router.post("/parent/signup", uploader.single('image'), (req, res, next) => {
    try {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const city = req.body.city;
        const country = req.body.country;
        const kids = req.body.kids;
        const days = req.body.days;
        const image = req.file.path;


        if (username == "" || password == "") {
            res.render("auth/parent/signup", {
                errorMessage: "Indicate a username and a password to sign up"
            });
            return;
        }

        Parent.findOne({ "username": username })
            .then(user => {
                if (user !== null) {
                    res.render("auth/parent/signup", {
                        errorMessage: "The username already exists!"
                    });
                    return;
                }

                const salt = bcrypt.genSaltSync(bcryptSalt);
                const hashPass = bcrypt.hashSync(password, salt);

                Parent.create({
                        firstName,
                        lastName,
                        username,
                        email,
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
            });
    } catch (error) {
        console.log(error);
    }
});

router.post('/parent/signup', function(req, res) {
    try {

        if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
            return res.json({ "responseError": "Please select captcha first" });
        }

        const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + process.env.RECAPTHA_SECRET_KEY + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

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

router.get("/parent/login", (req, res) => {
    res.render("auth/parent/login", {
        updatePasswordSuccessMsg: req.flash('updatePasswordSuccessMsg'),
        sendPasswordSuccessMsg: req.flash('sendPasswordSuccessMsg'),
        sendPasswordErrorMsg: req.flash('sendPasswordErrorMsg'),
        sendRecoverErrorMsg: req.flash('sendRecoverErrorMsg'),
        sendTokenErrorMsg: req.flash('sendTokenErrorMsg'),
        layout: false
    });
});

router.post("/parent/login", (req, res, next) => {
    try {
        const theUsername = req.body.username;
        const thePassword = req.body.password;
        debugger
        if (theUsername === "" || thePassword === "" || thePassword.length < 3 || theUsername.length < 3) {
            res.render("auth/parent/login", {
                errorMessage: "Please check both, username and password to log in."
            });
            return;
        }
        //if parent Parent.findOne else Sitter.findOne

        Parent.findOne({ "username": theUsername })
            .then(user => {
                if (!user) {
                    // debugger
                    res.render("auth/parent/login", {
                        layout: false,
                        errorMessage: `The username > ${theUsername} < doesn't exist.`
                    });
                    return;
                }
                if (bcrypt.compareSync(thePassword, user.password)) {
                    // Save the login in the session!
                    req.session.currentUser = user;
                    req.session.family = user;
                    res.redirect("/babysitters");
                } else {
                    res.render("auth/parent/login", {
                        layout: false,
                        errorMessage: "Incorrect login, try again!",

                    })
                }
            })
            .catch(error => {
                next(error);
            });
    } catch (error) {
        console.log(error);
    }
});

// ===EMAIL VERIFICATION
// @route GET api/verify/:token
// @desc Verify token
// @access Public
router.get('/verify/:token', async function(req, res) {
    if (!req.params.token) {
        return res
            .status(400)
            .json({ message: 'We were unable to find a user for this token.' });
    }

    try {
        // Find a matching token
        const token = await Token.findOne({ token: req.params.token });

        if (!token) {
            return res.status(400).json({
                message: 'We were unable to find a valid token. Your token my have expired.'
            });
        }

        // If we found a token, find a matching user
        Parent.findOne({ _id: token.userId }, (err, user) => {
            if (!user)
                return res.status(400).json({
                    message: 'We were unable to find a user for this token.'
                });

            if (user.isVerified)
                return res
                    .status(400)
                    .json({ message: 'This user has already been verified.' });

            // Verify and save the user
            user.isVerified = true;
            user.save(function(err) {
                if (err) return res.status(500).json({ message: err.message });

                res.status(200).send(
                    'The account has been verified. Please log in.'
                );
            });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route POST api/resend
// @desc Resend Verification Token
// @access Public
router.post('/resend', async function(req, res) {
    try {
        const { email } = req.body;

        const user = await Parent.findOne({ email });
        console.log(user);

        if (!user)
            return res.status(401).json({
                message: 'The email address ' +
                    req.body.email +
                    ' is not associated with any account. Double-check your email address and try again.'
            });

        if (user.isVerified)
            return res.status(400).json({
                message: 'This account has already been verified. Please log in.'
            });

        await sendVerificationEmail(user, req, res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

async function sendVerificationEmail(user, req, res) {
    try {
        const token = user.generateVerificationToken();

        // Save the verification token
        await token.save();

        let subject = 'Account Verification Token';
        let to = user.email;
        let from = process.env.FROM_EMAIL;
        let link = 'https://allthesebabysteps.herokuapp.com/reset/' + token.token;
        let html = `<p>Hi ${user.username}<p><br><p>Please click on the following <a href="${link}">link</a> to verify your account.</p> 
                  <br><p>If you did not request this, please ignore this email.</p>`;

        await sendEmail({ to, from, subject, html });

        res.status(200).json({
            message: 'A verification email has been sent to ' + user.email + '.'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

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