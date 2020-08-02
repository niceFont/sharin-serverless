const { generateHash, isSamePassword } = require('./hash');

describe('hash', () => {
  describe('generateHash', () => {
    it('returns hash', async () => {
      await expect(generateHash('password')).resolves.toEqual(expect.any(String));
    });
  });

  describe('isSamePassword', () => {
    it('compares passwords and returns true', async () => {
      const hash = await generateHash('password');
      await expect(isSamePassword('password', hash)).resolves.toEqual(true);
    });

    it('compares passwords and returns false', async () => {
      await expect(isSamePassword('password', 'password')).resolves.toEqual(false);
    });
  });
});
