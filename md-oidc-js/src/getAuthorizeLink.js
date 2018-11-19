/* Constructs the authorization link */
import uuidv4 from './util/uuidv4';
import generateCodeVerifier from './generateCodeVerifier';
import generatePkceChallenge from './generatePkceChallenge';
import $ from 'jQuery';

/* Constructs the authorization link */
function getAuthorizeLink(config, params, authorizeParamStorage) {

  // custom storage, used for iFramed flows
  authorizeParamStorage = authorizeParamStorage || sessionStorage;

  if (sessionStorage.getItem('state')) {
    console.warn('getAuthorizationLink: Detected state in sessionStorage, may cause trouble.');
  }

  params = params || {};

  // defaults
  params['client_id'] = config.clientId;
  params['response_type'] = 'code';

  // Generate a unique state verifier
  params['state'] = uuidv4();
  console.log('getAuthorizationLink: Created new state:', params.state);

  // Generate a unique verifier
  let verifier = generateCodeVerifier(128);

  console.log('getAuthorizationLink: Created new verifier', verifier);

  // store values for use in callback.html
  authorizeParamStorage.setItem('code_verifier', verifier);
  authorizeParamStorage.setItem('state', params.state);

  // generate a pkce challenge from the verifier
  params['code_challenge_method'] = 'S256';
  params['code_challenge'] = generatePkceChallenge('S256', verifier);
  console.log('getAuthorizationLink: Generated challenge', params.code_challenge);

  // ensure a redirect uri is set
  params['redirect_uri'] = params.redirect_uri || config.redirectUri;

  // remember used redirect uri for token request
  authorizeParamStorage.setItem('redirect_uri', params.redirect_uri);

  let query = $.param(params);

  // construct the authorize url
  let authorize = `${config.oidcBaseUrl}/authorize?${query}`;

  console.log('getAuthorizationLink: Generated authorize url', authorize);

  return authorize;

}

export default getAuthorizeLink;
