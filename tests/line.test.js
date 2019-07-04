const line = require('../line');
const got = require('got');

jest.mock('got');

async function retrieveToken() {
    got.mockResolvedValue({body: JSON.stringify({access_token: 'token'})});
    const token = await line.retrieveToken('code', 'redirectUri', 'clientId', 'clientSecret', 'url');
    return token;
}

test('Call api and retrieve token', async () => {
    await retrieveToken();
    expect(got.mock.calls.length).toBe(1);
});
