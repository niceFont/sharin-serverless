const { handler } = require('./authorizer');

describe('authorize', () => {
  let event;
  beforeEach(() => {
    event = {
      headers: {
        auth: 'test',
      },
      methodArn: 'somefakearn',
    };
  });

  it('returns an Allow Policy', async () => {
    const result = await handler(event);
    expect(result).toEqual(expect.objectContaining({
      principalId: expect.stringMatching('user'),
      policyDocument: expect.objectContaining(
        {
          Version: expect.stringMatching('2012-10-17'),
          Statement: expect.arrayContaining([{
            Action: expect.stringMatching('execute-api:Invoke'),
            Effect: expect.stringMatching('Allow'),
            Resource: expect.stringMatching(event.methodArn),
          }]),
        },
      ),
    }));
  });

  it('returns a Deny Policy', async () => {
    event.headers = {};
    const result = await handler(event);
    expect(result).toEqual(expect.objectContaining({
      principalId: expect.stringMatching('user'),
      policyDocument: expect.objectContaining(
        {
          Version: expect.stringMatching('2012-10-17'),
          Statement: expect.arrayContaining([{
            Action: expect.stringMatching('execute-api:Invoke'),
            Effect: expect.stringMatching('Deny'),
            Resource: expect.stringMatching(event.methodArn),
          }]),
        },
      ),
    }));
  });

  it('returns null', async () => {
    event.methodArn = null;
    const result = await handler(event);
    expect(result).toEqual(expect.objectContaining({
      principalId: expect.stringMatching('user'),
      policyDocument: null,
    }));
  });
});
