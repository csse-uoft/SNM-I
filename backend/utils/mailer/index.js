const nodemailer = require('nodemailer');
const {getVerificationTemplate, getResetPasswordTemplate, getUpdateEmailTemplate} = require("./template");
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
    console.log("http://localhost:5001/register/" + token)
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

const sendResetPasswordEmail = async (email, token) => {
  const mailOptions = {
    from: mailConfig.from,
    to: email,
    subject: 'Reset Password',
    ...getResetPasswordTemplate(email, token)
  };
  await new Promise((resole, reject) => {
    console.log("http://localhost:5001/resetPassword/" + token)
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

const sendUpdatePrimaryEmail = async (id, email, token) => {
  const mailOptions = {
    from: mailConfig.from,
    to: email,
    subject: 'Verification of changing primary email address.',
    ...getUpdateEmailTemplate(id, email, token)
  };
  await new Promise((resole, reject) => {

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

module.exports = {sendVerificationMail, sendResetPasswordEmail, sendUpdatePrimaryEmail};
