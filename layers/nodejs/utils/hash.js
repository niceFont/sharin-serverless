const bcrypt = require('bcrypt');

const saltRounds = 10;

const generateHash = async (password) => bcrypt.hash(password, saltRounds);

const isSamePassword = async (password, hash) => bcrypt.compare(password, hash);

module.exports = {
  isSamePassword,
  generateHash,
};
