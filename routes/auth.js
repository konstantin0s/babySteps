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
const TokenSitter = require('../models/sitterToken');

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
        const email = req.body.email;
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
                        email,
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

router.post('/sitter/signup', async function(req, res, next) {
    try {
        if (
            req.body['g-recaptcha-response'] === undefined ||
            req.body['g-recaptcha-response'] === '' ||
            req.body['g-recaptcha-response'] === null
        ) {
            return res.json({ responseError: 'Please select captcha first' });
        }
        const secretKey = process.env.RECAPTHA_SECRET_KEY;

        const verificationURL =
            'https://www.google.com/recaptcha/api/siteverify?secret=' + secretKey +
            '&response=' +
            req.body['g-recaptcha-response'] +
            '&remoteip=' +
            req.connection.remoteAddress;

        await request(verificationURL, function(error, response, body) {
            body = JSON.parse(body);

            if (body.success !== undefined && !body.success) {
                res.render('auth/sitter/signup', {
                    errorMessage: 'Failed captcha verification'
                });
                return;
            }
            // res.json({ "responseSuccess": "Success" });
            res.redirect('auth/sitter/login');
        }).catch((error) => {
            next(error);
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/sitter/login", (req, res) => {
    res.render("auth/sitter/login", {
        updatePasswordSuccessMsg: req.flash('updatePasswordSuccessMsg'),
        sendPasswordSuccessMsg: req.flash('sendPasswordSuccessMsg'),
        sendPasswordErrorMsg: req.flash('sendPasswordErrorMsg'),
        sendRecoverErrorMsg: req.flash('sendRecoverErrorMsg'),
        sendTokenErrorMsg: req.flash('sendTokenErrorMsg'),
        layout: false
    });
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
        const token = await TokenSitter.findOne({ token: req.params.token });

        if (!token) {
            return res.status(400).json({
                message: 'We were unable to find a valid token. Your token my have expired.'
            });
        }

        // If we found a token, find a matching user
        Babysitter.findOne({ _id: token.userId }, (err, user) => {
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

        const user = await Babysitter.findOne({ email });
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