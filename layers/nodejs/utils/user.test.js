const { getUser } = require('./user');

describe('user', () => {
  let fakeClient;
  beforeEach(() => {
    fakeClient = {
      query: jest.fn().mockResolvedValue([{ user: 'hey' }]),
    };
  });
  it('gets the user with userid', async () => {
    await expect(getUser(fakeClient, { userid: 1 })).resolves.toEqual({ user: 'hey' });
    expect(fakeClient.query).toHaveBeenCalledWith('SELECT userid, username, email, password FROM users WHERE ?', { userid: 1 });
  });
  it('gets the user with username', async () => {
    await expect(getUser(fakeClient, { username: 'test' })).resolves.toEqual({ user: 'hey' });
    expect(fakeClient.query).toHaveBeenCalledWith('SELECT userid, username, email, password FROM users WHERE ?', { username: 'test' });
  });
  it('gets the user with email and username', async () => {
    await expect(getUser(fakeClient, { username: 'test', email: 'test@test' })).resolves.toEqual({ user: 'hey' });
    expect(fakeClient.query).toHaveBeenCalledWith('SELECT userid, username, email, password FROM users WHERE username = ? AND email = ?', ['test', 'test@test']);
  });
});
