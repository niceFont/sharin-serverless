const { lambdaHandler } = require('./app');

jest.mock('../layers/nodejs/node_modules/serverless-mysql', () => jest.fn().mockReturnValue({
  end: jest.fn().mockResolvedValue(),
  query: jest.fn().mockResolvedValue(),
}));
jest.mock('../layers/nodejs/utils/hash');
jest.mock('../layers/nodejs/utils/user');

const { isSamePassword } = require('../layers/nodejs/utils/hash');
const { getUser } = require('../layers/nodejs/utils/user');
const mysql = require('../layers/nodejs/node_modules/serverless-mysql');

describe('auth-login', () => {
  let event;
  beforeEach(() => {
    getUser.mockResolvedValue({ user: 'hey' });
    isSamePassword.mockResolvedValue(true);
    event = {
      body: JSON.stringify({
        username: 'user',
        password: 'password',
      }),
    };
  });

  it('returns status 200', async () => {
    await expect(lambdaHandler(event)).resolves.toEqual({
      statusCode: 200,
      message: 'Successfully logged in',
      headers: {
        'Set-Cookie': 'u=randomuser',
      },
    });
  });

  it('returns status 400 with missing password or username', async () => {
    event.body = JSON.stringify({});
    await expect(lambdaHandler(event)).resolves.toEqual({
      statusCode: 400,
    });
  });

  it('returns status 400 if user does not exist', async () => {
    getUser.mockResolvedValue();
    await expect(lambdaHandler(event)).resolves.toEqual({
      statusCode: 400,
      message: 'User not Found',
    });
  });

  it("returns status 400 if passwords don't match", async () => {
    isSamePassword.mockReturnValue(false);

    await expect(lambdaHandler(event)).resolves.toEqual({
      statusCode: 400,
      message: "Username and Password don't match",
    });
  });

  it('returns error', async () => {
    const err = new Error('Bad Error');
    getUser.mockRejectedValue(err);
    await expect(lambdaHandler(event)).resolves.toEqual(err);
  });
});
