const isAWS = !!process.env.AWS;
/* istanbul ignore next */ const mysql = require(isAWS ? 'mysql' : '../layers/nodejs/node_modules/serverless-mysql')({
  config: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'wobble',
  },
});
/* istanbul ignore next */ const { generateHash } = require(isAWS ? '/opt/nodejs/utils/hash' : '../layers/nodejs/utils/hash');

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

exports.lambdaHandler = async (event) => {
  try {
    console.log(event);
    const { username, email, password } = JSON.parse(event.body);
    if (!username || !email || !password) {
      return {
        statusCode: 400,
      };
    }
    const hashedPassword = generateHash(password);
    await mysql.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
    return {
      statusCode: 200,
    };
  } catch (err) {
    console.log(err);
    return err;
  }
};
