import 'bootstrap';
import Oidc from '../../md-oidc-js/lib/md-oidc-js';
import $ from 'jquery';
import onToken from './onToken';
import onInitialError from './onInitialError';
import {checkAuthenticating, onStartAuthentication} from './authentication';
import {inIframe, onAuthorizeLinkClick} from './util';

require('normalize.css/normalize.css');
require('./styles/index.scss');

const config = require('./config/config');

$(document).ready(function () {
  // make sure we are loaded in top location
  if (inIframe()) {
    window.parent.location.href = document.location.href;
    return;
  }

  // iframe height event listener
  window.addEventListener('message', function (event) {
    if (event && typeof (event.data) === 'object' &&
            event.data.text && event.data.text === 'heightChange') {
      console.log('main ==> iframe height change detected!', event.data);
      $('#login').height(event.data.height);
    }
  });

  let localConfig = config[document.location.hostname];

  // MD-OIDC JavaScript Lib
  const mdoidc = new Oidc(localConfig, onStartAuthentication);

  // Button click behaviour
  $('#loginButton').click(onAuthorizeLinkClick(mdoidc, {'acr_values': '1', 'login_url': 'login'}));
  $('#forceLoginButton').click(onAuthorizeLinkClick(mdoidc, {'prompt': 'login', 'login_url': 'login'}));

  // Logout Button
  $('#logoutButton').click(function (e) {
    const token = sessionStorage.getItem('token');
    const query = $.param({
      'post_logout_redirect_uri': localConfig.logoutRedirectUrl,
      'access_token': token
    });

    $('#loginButton').removeClass('d-none');
    $('#forceLoginButton').addClass('d-none');
    $('#logoutButton').addClass('d-none');
    $(this).prop('href', `${localConfig.oidcBaseUrl}/endsession?${query}`);
    return checkAuthenticating(e);
  });

  // Callback Erkennung oder ggf. Rückgabe eines vorhandenen Tokens aus dem sessionStorage
  // Falls kein Token erzeugt oder gefunden wird, onInitialError aufrufen
  mdoidc.handleCallback().then(onToken(mdoidc), onInitialError(mdoidc));
});
