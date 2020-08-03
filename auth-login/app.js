const isAWS = !!process.env.AWS;
/* istanbul ignore next */ const mysql = require(isAWS ? 'serverless-mysql' : '../layers/nodejs/node_modules/serverless-mysql')({
  config: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'wobble',
  },
});
/* istanbul ignore next */ const { isSamePassword } = require(isAWS ? '/opt/nodejs/utils/hash' : '../layers/nodejs/utils/hash');
/* istanbul ignore next */ const { getUser } = require(isAWS ? '/opt/nodejs/utils/user' : '../layers/nodejs/utils/user');

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
    const { username, password } = JSON.parse(event.body);
    if (!username || !password) {
      return {
        statusCode: 400,
      };
    }
    const user = await getUser(mysql, { username });
    if (!user) {
      return {
        statusCode: 400,
      };
    }
    const isSame = await isSamePassword(password, user.password);
    if (!isSame) {
      return {
        statusCode: 400,
      };
    }
    await mysql.end();
    return {
      statusCode: 200,
      headers: {
        'Set-Cookie': 'u=randomuser',
      },
    };
  } catch (err) {
    console.log(err);
    return err;
  }
};
