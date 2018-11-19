// Nach dem ersten Versuch, ein Callback zu erkennen bzw. den vorhandenen Token zu nutzen
import onToken from './onToken';
import showLoginForm from './showLoginForm';

function onInitialError(mdoidc) {
  return function () {
    // Wenn kein Token aus dem initialen handleAuthorizationCallback zurück kommt,
    // versuche ein Login im Login Frame, im Fehlerfall zeige die Login Form
    mdoidc.tryLogin().then(onToken(mdoidc), showLoginForm(mdoidc));
  };
}

export default onInitialError;
