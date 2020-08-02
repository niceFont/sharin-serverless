const { lambdaHandler } = require('./app');

jest.mock('../layers/nodejs/node_modules/serverless-mysql', () => jest.fn().mockReturnValue({
  end: jest.fn().mockResolvedValue(),
  query: jest.fn().mockResolvedValue(),
}));
jest.mock('../layers/nodejs/utils/hash');
jest.mock('../layers/nodejs/utils/user');

const { generateHash } = require('../layers/nodejs/utils/hash');
const mysql = require('../layers/nodejs/node_modules/serverless-mysql');

describe('auth-signup', () => {
  let event;
  beforeEach(() => {
    generateHash.mockResolvedValue('randomHash');
    event = {
      body: JSON.stringify({
        username: 'user',
        email: 'email',
        password: 'password',
      }),
    };
  });

  it('returns status 200', async () => {
    await expect(lambdaHandler(event)).resolves.toEqual({
      statusCode: 200,
    });
  });

  it('returns status 400 with missing password or username or email', async () => {
    event.body = JSON.stringify({});
    await expect(lambdaHandler(event)).resolves.toEqual({
      statusCode: 400,
    });
  });

  it('returns error', async () => {
    const err = new Error('Bad Error');
    mysql().query.mockRejectedValue(err);
    await expect(lambdaHandler(event)).resolves.toEqual(err);
  });
});
