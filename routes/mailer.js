const express = require('express');
const router  = express.Router();
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

let auth = require('./config.json');

const transporter = nodemailer.createTransport({
  service: 'Sendgrid',
  auth: {
    user: auth.SENDGRID_USERNAME, pass: auth.SENDGRID_PASSWORD
  }
});




router.post('/sendEmail', (req, res)=>{
    let email = req.body.email;
    let message = req.body.message;
    let name = req.body.name;
    let gif = req.body.gif;

    transporter.sendMail({
        from: 'nodemailbobthebot@gmail.com',
        to: email,
        subject: `${name}` ,
        html: `<h3>${message}</h3>`
        }, (err, info)=>{
            if(err){
                res.send(err);
            }
            else{
                console.log('after info');
                res.status(200).json({
                success: true,
                message: 'Email Sent'
                });
            }
        });
});


$(document).ready(function(){
  $('.parallax').parallax();

  $(document).on('change', '.checkInput', function(event){
    let name = $('#name').val();
    let email = $('#email').val();
    let message = $('#message').val();

    if(name !== '' && email !== ''){
      $('#submit').attr('disabled', false);
    }
    else if(name === '' || email === ''){
      $('#submit').attr('disabled', true);        
    }
  });

  $(document).on('click', '#submit', function(event){
    event.preventDefault();
    const queryUrl = "https://api.giphy.com/v1/gifs/random?tag=dog&api_key=dc6zaTOxFJmzC&rating=g";
    $.get(queryUrl, (data)=>{
      let gif = data.data.image_url;
      let name = $('#name').val();
      let email = $('#email').val();
      let message = $('#message').val();
      
      $.post('/sendEmail', {
        name: name,
        email: email,
        message: message,
        gif: gif
      }).done((data)=>{
        console.log(data);
        if(data.success){
          $('#name').val('');
          $('#email').val('');
          $('#message').val('');
          Materialize.toast('Email is on its way!', 4000);
        }
      });
    });
  });

  module.exports = router;