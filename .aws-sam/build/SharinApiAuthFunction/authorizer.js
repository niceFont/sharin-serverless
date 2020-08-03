const generatePolicy = (effect, arn) => {
  if (!arn) return null;

  return {
    Version: '2012-10-17',
    Statement: [{
      Action: 'execute-api:Invoke',
      Effect: effect,
      Resource: arn,
    }],
  };
};

const generateResponse = (principalId, effect, arn) => {
  const policyDocument = generatePolicy(effect, arn);

  return {
    principalId,
    policyDocument,
  };
};

exports.handler = async (event) => {
  console.log(event);

  const {
    headers,
    methodArn,
  } = event;

  if (headers.auth === 'test') {
    return generateResponse('user', 'Allow', methodArn);
  }
  return generateResponse('user', 'Deny', methodArn);
};
