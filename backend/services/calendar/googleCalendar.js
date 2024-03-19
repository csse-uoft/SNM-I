// const {google} = require('googleapis');
//
// const GOOGLE_CLIENT_ID = "97097151571-4mfu6di9l4qg6baibofrr3d3e46fh354.apps.googleusercontent.com";
// const GOOGLE_CLIENT_SECRET = "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";
//
// const oAuth2Client = new google.auth.OAuth2(
//   GOOGLE_CLIENT_ID,
//   GOOGLE_CLIENT_SECRET,
//   "http://localhost:3000/calendar"
// );
//
//
// async function fetchGoogleAppointments(req, res, next){
//   try {
//     const {code} = req.body;
//     const response = await oAuth2Client.getToken(code);
//     res.send(response);
//   } catch (error){
//     next(error);
//   }
// }
//
//
//
// module.exports = {fetchGoogleAppointments};