const getUser = async (client, { userid, email, username }) => {
  if (userid) {
    return client.query('SELECT userid, username, email, password FROM users WHERE ?', { userid });
  } if (!email) {
    return client.query('SELECT userid, username, email, password FROM users WHERE ?', { username });
  }
  return client.query('SELECT userid, username, email, password FROM users WHERE username = ? AND email = ?', [username, email]);
};

module.exports = {
  getUser,
};
