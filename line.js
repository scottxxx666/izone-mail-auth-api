const FormData = require('form-data');
const got = require('got');

async function retrieveToken(code, redirectUri, clientId, clientSecret, url) {
    const form = new FormData();
    form.append('grant_type', 'authorization_code');
    form.append('code', code);
    form.append('redirect_uri', redirectUri);
    form.append('client_id', clientId);
    form.append('client_secret', clientSecret);

    const result = await got(url, {body: form});
    console.log(result.body);

    return JSON.parse(result.body).access_token;
}

module.exports = {
    retrieveToken: retrieveToken,
}
