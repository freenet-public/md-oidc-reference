// Callback Funktion bei Session State "changed" event
import $ from 'jquery';
import displayCurrentDate from './displayCurrentDate';
import onInitialError from './onInitialError';

function onSessionStateChanged(mdoidc) {
  return function () {
    sessionStorage.clear();
    const defaultStatus = '<span class="badge badge-danger">Nicht eingeloggt</span>';

    console.log('main ==> Session State Changed!');
    // Re-Init login buttons (new state / code_challenge)
    $('#userStatus').html(defaultStatus);
    $('#softloginStatus').html(defaultStatus);
    $('#sessionState').html('<span class="badge badge-warning">verändert</span>' +
            ' (letzer Check: ' + displayCurrentDate() + ')');
    $('#loginButton').removeClass('d-none');
    $('#forceLoginButton').addClass('d-none');
    $('#logoutButton').addClass('d-none');
    // Versuche ein neues Token zu holen, ggf. "nur" Softlogin
    onInitialError(mdoidc)();
  };
}

// Callback Funktion bei Session State "unchanged" event
function onSessionStateUnchanged() {
  $('#sessionState').html('<span class="badge badge-success">unverändert</span>' +
        ' (letzer Check: ' + displayCurrentDate() + ')');
}

// Callback Funktion bei Session State "error" event
function onSessionStateError() {
  $('#sessionState').html('<span class="badge badge-danger">Fehler</span>' +
        ' (letzer Check: ' + displayCurrentDate() + ')');
}

export {
  onSessionStateChanged,
  onSessionStateError,
  onSessionStateUnchanged
};
