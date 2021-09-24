import 'source-map-support/register';

const generatePolicy = (principalId, effect, resource) => {
  const authResponse: any = {};

  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument: any = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    const statementOne: any = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }

  return authResponse;
}

const deny = (methodArn) => generatePolicy('user', 'Deny', methodArn);
const allow = (methodArn) => generatePolicy('user', 'Allow', methodArn);

export const main = async (event, _, callback) => {
  const token = event.authorizationToken.replace("Basic ", "");
  const credentials = Buffer.from(token, 'base64').toString().split(":");

  if(credentials.length !== 2) {
    callback('Unauthorized');
  }

  const [username, password] = credentials;

  if(process.env[username] === password) {
    return callback(null, allow(event.methodArn));
  }
  else return callback(null, deny(event.methodArn));
}

