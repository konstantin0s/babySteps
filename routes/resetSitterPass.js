const express = require('express');
const Babysitter = require("../models/babysitter");
const { sendEmail } = require('../utils/index');
const router = express.Router();

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);



router.get('/recover', async(req, res) => {
    res.render('recover', { layout: false })
});


// @route POST /auth/recover
// @desc Recover Password - Generates token and Sends password reset email
// @access Public
router.post("/recover", async(req, res) => {
    try {
        const email = req.body.email;
        console.log('email log', email)

        const user = await Babysitter.findOne({ "email": email })
        console.log(user)
        if (!user) {
            res.redirect('recover');
            req.flash('sendRecoverErrorMsg', 'The email address ' + req.body.email + ' is not associated with any account.Double-check your email address and try again.');
            return res.status(401);
        }

        //Generate and set password reset token
        user.generatePasswordReset();

        // Save the updated user object
        await user.save();

        // send email
        let subject = "Password change request";
        let to = user.email;
        let from = 'constantintofan85@gmail.com'
        let link = "http://localhost:5000/reset/" + user.resetPasswordToken;
        let html = `<p>Hi ${user.username}</p>
                    <p>Please click on the following <a href="${link}">link</a> to reset your password.</p> 
                    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`;

        await sendEmail({ to, from, subject, html });
        req.flash('sendPasswordSuccessMsg', 'A reset email has been sent to ' + user.email);
        res.redirect("/sitter/login");
    } catch (error) {
        req.flash('sendPasswordErrorMsg', "A reset email couldn't been sent");
    }
});

// @route POST api/auth/reset
// @desc Reset Password - Validate password reset token and shows the password reset view
// @access Public
router.get("/reset/:token", async(req, res, next) => {
    try {
        const { token } = req.params;

        const user = await Babysitter.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

        if (!user) {
            req.flash('sendUserErrorMsg', "There is no user registered on this website");
        }

        //Redirect user to form with the email address
        res.render('reset', {
            user,
            token,
            layout: false
        });
    } catch (error) {
        req.flash('sendTokenErrorMsg', "The token could not be verified. Please try again. ");
    }
});

// @route POST api/auth/reset
// @desc Reset Password
// @access Public
router.post("/reset/:token", async(req, res) => {
    try {
        const { token } = req.params;

        const user = await Babysitter.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

        if (!user) {
            return req.flash('sendPasswordErrorMsg', 'Password reset token is invalid or has expired.');
        }

        //Set the new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.isVerified = true;

        // Save the updated user object
        await user.save();

        let subject = "Your password has been changed";
        let to = user.email;
        let from = process.env.FROM_EMAIL;
        let html = `<p>Hi ${user.username}</p>
                    <p>This is a confirmation that the password for your account ${user.email} has just been changed.</p>`

        await sendEmail({ to, from, subject, html });
        req.flash('updatePasswordSuccessMsg', 'Password updated successfully!');
        res.redirect("/sitter/login");
    } catch (error) {
        return req.flash('sendPasswordErrorMsg', 'Password not updated, please try again.');
    }
});

module.exports = router;