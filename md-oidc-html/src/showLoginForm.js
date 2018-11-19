import onToken from './onToken';
import {onEndAuthentication} from './authentication';

function showLoginForm(mdoidc) {

  return function () {
    // Wenn kein Token aus dem initialen handleAuthorizationCallback zurück kommt,
    // zeige die MLP an, im Fehlerfall ggf. aufräumen
    mdoidc.tryLogin({
      frameId: 'login',
      query: {
        'display': 'iframe',
        'acr_values': '1',
        'login_url': 'login'
      }
    }).then(onToken(mdoidc), onEndAuthentication);
  };
}

export default showLoginForm;
