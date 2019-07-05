const index = require('../index');
const line = require('../line');
const dao = require('../dao');

jest.mock('../line');
jest.mock('../dao');

beforeEach(() => {
    jest.clearAllMocks();
});

test('When Event no code Handler should throw Exception', async () => {
    await expect(index.handler(null)).rejects.toThrow();
});

test('Handler should retrieve token and save it', async () => {
    line.retrieveToken.mockResolvedValue('token')
    await index.handler({code: 'code'});
    expect(line.retrieveToken).toBeCalled();
    expect(dao.saveToken).toBeCalledWith('token');
});
