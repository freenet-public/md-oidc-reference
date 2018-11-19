// Sollte am Ende des Autentifizierungsprozesses aufgerufen werden
import $ from 'jquery';

// Flag ob im Hintergrund der Autentifizierungsprozess läuft
let isAuthenticating = false;

function onEndAuthentication() {
  console.log('main ==> removing before unload event listener ...');
  isAuthenticating = false;
  window.onbeforeunload = null;
  $('#waitForAuth').modal('hide');
  $('a.btn').removeClass('disabled');
  $('#loginSpinner').collapse('hide');
}

// Wird aufgerufen, bevor der /token request abgesendet wird
function onStartAuthentication() {
  console.log('main ==> started authentication process ...');
  isAuthenticating = true;
  // Verhindere navigation ...
  window.onbeforeunload = function () {
    return 'Im Hintergrund läuft die Authentifizierung...';
  };
  // Disable Login Buttons
  $('a.btn').addClass('disabled');
  $('#loginSpinner').collapse('show');
}

// Hilfsfunktion für Dialog wenn Hintergrundprozess läuft...
function checkAuthenticating(e) {
  if (isAuthenticating) {
    // Autentifizierungsprozess läuft, verhindere click
    e.preventDefault();
    $('#waitForAuth').modal({
      keyboard: false,
      backdrop: 'static'
    });
    return false;
  }
  return true;
}

export {
  onEndAuthentication,
  onStartAuthentication,
  checkAuthenticating
};
