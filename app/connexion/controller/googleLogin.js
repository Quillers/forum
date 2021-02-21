const { google } = require('googleapis');
const OAuth2Data = require('./google_key.json')

/*
This is where we try to log in with google account...
*/

/**
 * Part 1: Create a Google URL and send it to the client in order for the user to log in.
 */

/**
 * Part 2: Take the "code" parameter which Google gives us when the user logs in, then get the user's email and id.
 */

const auth = new google.auth.OAuth2(

  OAuth2Data.web.client_id,
  OAuth2Data.web.client_secret,
  OAuth2Data.web.redirect_uris,

);

const url = auth.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
]
});

const getGoogleAccountFromCode = async (code) => {

  try {
    const data = await auth.getToken(code);
    const tokens = data.tokens;

    auth.setCredentials(tokens);

    const people = google.people({ version: 'v1', auth });

    const me = await people.people.get({
      personFields: [`emailAddresses`, `names`],
      resourceName: 'people/me'
    });

    return {
      firstName: me.data.names[0].givenName,
      lastName: me.data.names[0].familyName,
      email: me.data.emailAddresses[0].value,
    };

  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  url,
  getGoogleAccountFromCode
}
