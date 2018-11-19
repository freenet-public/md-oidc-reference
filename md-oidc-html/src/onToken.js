// Callback Funktion wenn Token vorhanden
// Entweder aus dem local storage oder als response eines /authorize calls
import $ from 'jquery';
import {onEndAuthentication} from './authentication';
import Oidc from '../../md-oidc-js/lib/md-oidc-js';
import showLoginForm from './showLoginForm';
import {onSessionStateChanged, onSessionStateError, onSessionStateUnchanged} from './sessionState';

function onToken(mdoidc) {

  return function (token) {
    let payload = Oidc.getTokenPayload(token);

    console.log('main ==> got access token:', payload);
    let acr = payload && payload.acr;

    $('#userStatus').html('<span class="badge badge-success">Eingeloggt</span> als ' + payload.username);

    if (acr === '0') {
      $('#softloginStatus').html('<span class="badge badge-warning">Softlogin</span>');
      $('#sessionState').html('Wird für Softlogin nicht geprüft.');
      $('#loginButton').removeClass('d-none');
      $('#forceLoginButton').addClass('d-none');
      $('#logoutButton').addClass('d-none');
      // Zeige die Login Form im Frame
      showLoginForm(mdoidc)();
    } else if (acr === '1') {
      $('#softloginStatus').html('<span class="badge badge-success">Normales Login</span>');
      $('#sessionState').html('Wartet auf erste Prüfung ...');
      $('#loginButton').addClass('d-none');
      $('#forceLoginButton').removeClass('d-none');
      $('#logoutButton').removeClass('d-none');
      // Initialisiere Session State iframe, ruft sessionStateChanged auf,
      // wenn der State sich ändert (darf nicht für softlogin genutzt werden!)
      mdoidc.initSessionState(onSessionStateChanged(mdoidc), onSessionStateUnchanged, onSessionStateError);
    }
    onEndAuthentication();
  };
}

export default onToken;
