const nodemailer = require('nodemailer');
const {getVerificationTemplate} = require("./template");
const {mailConfig} = require('../../config');

const transporter = nodemailer.createTransport(mailConfig.mailServer);

const sendVerificationMail = async (email, token) => {
  const mailOptions = {
    from: mailConfig.from,
    to: email,
    subject: 'Account Verification',
    ...getVerificationTemplate(email, token)
  };
  await new Promise((resole, reject) => {
    console.log("http://localhost:5000/register/" + token)
    transporter.sendMail(mailOptions, function (err) {
      if (err) {
        reject(err);
      } else {
        console.log("email sent");
        resole();
      }
    });
  });
};

module.exports = {sendVerificationMail};
