/* Login iFrame */
import _ from 'lodash';
import getAuthorizeLink from './getAuthorizeLink';
import $ from 'jQuery';
import getOrigin from './util/getOrigin';
import CustomStorage from './util/CustomStorage';
import handleCallback from './handleCallback';

const tryLogin = (function () {

  let loginInit = false;

  return function (config, params) {
    return new Promise((resolve, reject) => {
      if (loginInit) return reject('tryLogin: Login already initialized!');
      loginInit = true;
      const sourceOrigin = getOrigin(config.frameRedirectUrl);
      const authorizationStorage = params ? sessionStorage : new CustomStorage();

      function receiveCallbackEvent(event) {

        if (event.origin !== sourceOrigin) {
          console.log('tryLogin#receiveCallbackEvent: Received message from wrong origin, ignoring', event.origin);
          return false;
        }

        if (!(event.data && typeof (event.data) === 'string' && event.data.startsWith(config.frameRedirectUrl))) {
          // not my business...
          return false;
        }

        console.log('tryLogin#receiveCallbackEvent: Event from softlogin iframe', event);
        // Clean up
        if (params && params.frameId) {
          $('#' + params.frameId).hide();
        } else {
          $('#login-iframe').remove();
        }
        window.removeEventListener('message', receiveCallbackEvent, true);
        loginInit = false;
        // if we have a token, init site
        if (_.includes(event.data, 'code')) {
          console.log('tryLogin#receiveCallbackEvent: Found code response, trying to get token.');
          return handleCallback(config, event.data, authorizationStorage)
            .then(resolve)
            .catch((err) => {
              console.log('tryLogin#receiveCallbackEvent: Could not get token, silent quit.', err);
              reject(err);
            });
        }
        reject('unknown response');
        return console.log('tryLogin#receiveCallbackEvent: No code in response, silent quit.', event.data);
      }

      // make sure postMessage is catched
      window.addEventListener('message', receiveCallbackEvent, true);
      if (params && params.frameId) {
        // assume "hard" login
        const query = params.query || {};

        query['redirect_uri'] = query['redirect_uri'] || config.redirectUri;
        let authZ = getAuthorizeLink(config, query, authorizationStorage);

        $('#' + params.frameId).prop('src', authZ).show();
      } else {
        // assume softlogin
        // create the authorization request for softlogin
        const authZ = getAuthorizeLink(config, {
          'prompt': 'none',
          'redirect_uri': config.frameRedirectUrl
        }, authorizationStorage);

        $('body').append(`<iframe id='login-iframe' src='${authZ}' style='display: none' />`);
      }
      return true;

    });
  };
}());

export default tryLogin;
