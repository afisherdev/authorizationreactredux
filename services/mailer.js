const nodemailer = require('nodemailer');
const keys = require('../config/keys');

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    type: 'OAuth2',
    user: 'noreply@johnolivercoin.com',
    clientId: keys.googleNodeMailerID,
    clientSecret: keys.googleNodeMailerSecret,
    refreshToken: keys.googleNodeMailerRefreshToken,
    accessToken: keys.googleNodeMailerAccessToken
  }
});

var mailOptions = {
  from: 'noreply@johnolivercoin.com',
  to: 'noreply@johnolivercoin.com',
  subject: 'Please Verify Your Email Address',
  text: 'Please verify your email address at this link: bla bla fuckin bla'
};

transporter.sendMail(mailOptions, function(err, res) {
  if (err) {
    console.log('Error:', err);
  } else {
    console.log('Sent the email!');
  }
});
