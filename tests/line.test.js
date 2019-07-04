const line = require('../line');
const got = require('got');

jest.mock('got');

beforeEach(() => {
    jest.clearAllMocks();
});

async function retrieveToken() {
    got.mockResolvedValue({body: JSON.stringify({access_token: 'fake token'})});
    const token = await line.retrieveToken('code', 'redirectUri', 'clientId', 'clientSecret', 'url');
    return token;
}

test('Retrieve token should get a token', async () => {
    expect(await retrieveToken()).toBe('fake token');
});

test('Retrieve token should call api once', async () => {
    await retrieveToken();
    expect(got.mock.calls.length).toBe(1);
});
