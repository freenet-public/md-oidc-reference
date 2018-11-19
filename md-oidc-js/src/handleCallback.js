import $ from 'jQuery';
import getQueryParams from './util/getQueryParams';
import {isNotExpired} from './jwt/getTokenPayload';
import clearAuthentication from './util/clearAuthentication';

// Try to get an access token with code and verifier
function getAccessToken(config, code, verifier, redirectUri, resolve, reject) {

  function onSuccess(res) {
    console.log('handleCallback#getAccessToken: Successful token request', res);
    sessionStorage.setItem('token', res['access_token']);
    // return the access token
    resolve(res['access_token']);
  }

  // Make token request
  $.ajax({
    url: config.oidcBaseUrl + '/token',
    method: 'POST',
    data: {
      'client_id': config.clientId,
      'grant_type': 'authorization_code',
      'code': code,
      'code_verifier': verifier,
      'redirect_uri': redirectUri
    }
  }).then(onSuccess, reject);

}

/* Authorization callback */
function handleCallback(config, url, authorizeParamStorage) {

  return new Promise(function (resolve, reject) {
    // get params from callback
    const params = getQueryParams(url);

    authorizeParamStorage = authorizeParamStorage || sessionStorage;

    // check if the request comes from a callback (authorize)
    if (params && params.state) {

      console.log('handleCallback: Found callback params', params);

      // get and check state parameter
      const state = authorizeParamStorage.getItem('state');
      // get the code verifier from the local storage
      const verifier = authorizeParamStorage.getItem('code_verifier');
      // get used redirect_uri from local storage
      const redirectUri = authorizeParamStorage.getItem('redirect_uri');

      // delete these params from the local storage for security
      authorizeParamStorage.removeItem('state');
      authorizeParamStorage.removeItem('code_verifier');
      authorizeParamStorage.removeItem('redirect_uri');

      // Just show the error and continue
      if (params.error) {
        return reject('Got an error from authorize: ' + params.error);
      }

      if (params['state'] === state) {

        console.log('handleCallback: State matches, try to get a token');

        // store the session state param (for use with session state iframe)
        sessionStorage.setItem('session_state', params['session_state']);

        // Notify that authentication process is started now
        config.onStartAuthentication && config.onStartAuthentication();

        // try to get an access token
        return setTimeout(() => {
          getAccessToken(config, params.code, verifier, redirectUri, resolve, reject);
        }
        , config.delayAuthenticationProcess ? config.delayAuthenticationProcess * 1000 : 0);

      }
      console.warn('handleCallback: States do not match!');
      // do not return an error here because this may also
      // happen on reload of the page with already used params,
      // return the current access token instead
    }
    console.log('handleCallback: No callback params, try to return stored token.');
    // No callback parameters detected, return stored token if found
    const token = sessionStorage.getItem('token');

    if (token && !isNotExpired(token)) {
      // clear storage
      clearAuthentication();
      return reject('Access token is expired');
    }

    return token ? resolve(token) : reject('No access token yet');
  });

}

export default handleCallback;
