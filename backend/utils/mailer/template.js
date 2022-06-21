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
module.exports = {getVerificationTemplate};
