const {frontend} = require('../../config');

const getVerificationTemplate = (userEmail, token) => {
  const text = `Please confirm your e-mail.

Verify your e-mail to finish signing up for SNM-I.
Please confirm that ${userEmail} is your e-mail address by clicking on this link within 24 hours.

${frontend.addr}/verify/${token}`


  const html = `
   <html>
     ${text.replaceAll('\n', '<br/>')}
  </html>
  `
  return {html, text}
}

const getResetPasswordTemplate = (userEmail, token) => {

  const text = `Please confirm your e-mail.

Verify your e-mail to go to the reset password page for SNM-I.
Please reset your password by clicking on this link within 24 hours.

${frontend.addr}/resetPassword/${token}`


  const html = `
   <html>
     ${text.replaceAll('\n', '<br/>')}
  </html>
  `
  return {html, text}
}

const getUpdateEmailTemplate = (id, userEmail, token) => {
  const text = `Please confirm your e-mail.

Verify your e-mail to finish updating your primary Email for SNM-I.
Please confirm that ${userEmail} is your new e-mail address by clicking on this link within 24 hours.

${frontend.addr}/update-primary-email/${token}`


  const html = `
   <html>
     ${text.replaceAll('\n', '<br/>')}
  </html>
  `
  return {html, text}
}


module.exports = {getVerificationTemplate, getResetPasswordTemplate, getUpdateEmailTemplate};
