/*
 Provides information about a person by specifying a resource name. Use `people/me` to indicate the authenticated user. The request returns a 400 error if 'personFields' is not specified.
 // Before running the sample:
 // - Enable the API at:
 //   https://console.developers.google.com/apis/api/people.googleapis.com
 // - Login into gcloud by running:
 //   `$ gcloud auth application-default login`
 // - Install the npm module by running:
 //   `$ npm install googleapis`
*/
const { google } = require('googleapis');
const people = google.people('v1');

async function main() {
  const auth = new google.auth.GoogleAuth({
    access_type: 'offline',
    prompt: 'consent',

    // Scopes can be specified either as an array or as a single, space-delimited string.
    scopes: [
       'https://www.googleapis.com/auth/contacts',
       'https://www.googleapis.com/auth/contacts.readonly',
       'https://www.googleapis.com/auth/directory.readonly',
       'https://www.googleapis.com/auth/user.addresses.read',
       'https://www.googleapis.com/auth/user.birthday.read',
       'https://www.googleapis.com/auth/user.emails.read',
       'https://www.googleapis.com/auth/user.gender.read',
       'https://www.googleapis.com/auth/user.organization.read',
       'https://www.googleapis.com/auth/user.phonenumbers.read',
       'https://www.googleapis.com/auth/userinfo.email',
       'https://www.googleapis.com/auth/userinfo.profile',
     ],
  });

  // Acquire an auth client, and bind it to all future calls
  const authClient = await auth.getClient();
  google.options({ auth: authClient });

  // Do the magic
  const res = await people.people.get({
    // Required. A field mask to restrict which fields on the person are returned. Multiple fields can be specified by separating them with commas. Valid values are: addresses ageRanges biographies birthdays calendarUrls clientData coverPhotos emailAddresses events externalIds genders imClients interests locales locations memberships metadata miscKeywords names nicknames occupations organizations phoneNumbers photos relations sipAddresses skills urls userDefined
    personFields: [`emailAddresses`, `names`],
    // Required. Comma-separated list of person fields to be included in the response. Each path should start with `person.`: for example, `person.names` or `person.photos`.
    'requestMask.includeField': [`person.names`, `person.photos`, `person.emailAddresses`],
    // Required. The resource name of the person to provide information about. - To get information about the authenticated user, specify `people/me`. - To get information about a google account, specify `people/{account_id\}`. - To get information about a contact, specify the resource name that identifies the contact as returned by [`people.connections.list`](/people/api/rest/v1/people.connections/list).
    resourceName: 'people/me',
    // Optional. A mask of what source types to return. Defaults to READ_SOURCE_TYPE_PROFILE and READ_SOURCE_TYPE_CONTACT if not set.
    sources: 'placeholder-value',
  });
  console.log(res.data);

  // Example response
  // {
  //   "addresses": [],
  //   "ageRange": "my_ageRange",
  //   "ageRanges": [],
  //   "biographies": [],
  //   "birthdays": [],
  //   "braggingRights": [],
  //   "calendarUrls": [],
  //   "clientData": [],
  //   "coverPhotos": [],
  //   "emailAddresses": [],
  //   "etag": "my_etag",
  //   "events": [],
  //   "externalIds": [],
  //   "fileAses": [],
  //   "genders": [],
  //   "imClients": [],
  //   "interests": [],
  //   "locales": [],
  //   "locations": [],
  //   "memberships": [],
  //   "metadata": {},
  //   "miscKeywords": [],
  //   "names": [],
  //   "nicknames": [],
  //   "occupations": [],
  //   "organizations": [],
  //   "phoneNumbers": [],
  //   "photos": [],
  //   "relations": [],
  //   "relationshipInterests": [],
  //   "relationshipStatuses": [],
  //   "residences": [],
  //   "resourceName": "my_resourceName",
  //   "sipAddresses": [],
  //   "skills": [],
  //   "taglines": [],
  //   "urls": [],
  //   "userDefined": []
  // }
}

main().catch(e => {
  console.error(e);
  throw e;
});
