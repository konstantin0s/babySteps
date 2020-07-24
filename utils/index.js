const path = require('path');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


function sendEmail(mailOptions) {
    return new Promise((resolve, reject) => {
        sgMail.send(mailOptions, (error, result) => {
            if (error) {
                return reject(error);
            }
            console.log(result);
            return resolve(result);
        });
    });
}

module.exports = { sendEmail };