const getUser = async (client, { userid, email, username }) => {
  let user;
  if (userid) {
    [user] = client.query('SELECT userid, username, email, password FROM users WHERE ?', { userid });
  } else if (!email) {
    [user] = client.query('SELECT userid, username, email, password FROM users WHERE ?', { username });
  } else {
    [user] = client.query('SELECT userid, username, email, password FROM users WHERE username = ? AND email = ?', [username, email]);
  }
  return user;
};

module.exports = {
  getUser,
};
