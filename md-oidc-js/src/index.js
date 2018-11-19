import getAuthorizeLink from './getAuthorizeLink';
import handleCallback from './handleCallback';
import tryLogin from './tryLogin';
import initSessionState from './initSessionState';
import _ from 'lodash';
import removeQuery from './util/removeQuery';
import getOrigin from './util/getOrigin';
import {getTokenPayload, isNotExpired} from './jwt/getTokenPayload';

const defaultConfig = {
  oidcBaseUrl: '__required__',
  clientId: '__required__',
  redirectUri: removeQuery(window.location.href),
  logoutRedirectUrl: '__required__',
  frameRedirectUrl: '__required__',
  // delay zu Demo-Zwecken (in Sekunden)
  delayAuthenticationProcess: 0,
  // wie oft soll die Gültigkeit der Session über den session iframe geprüft werden
  // (in Sekunden)
  checkInterval: 5,
  // wie oft soll die Gültigkeit der Session über eine Aufruf des Backends geprüft werden
  // (in Sekunden),
  revalidate: 20,
  // Funktion, welche vor dem Abruf des Tokens aufgerufen wird
  onStartAuthentication: () => {}
};

class Oidc {
  constructor(config, onStartAuthentication) {
    this._name = 'Oidc';
    this._config = _.assign({}, defaultConfig, config);
    this._config.oidcOrigin = getOrigin(this._config.oidcBaseUrl);
    if (onStartAuthentication) {
      this._config.onStartAuthentication = onStartAuthentication;
    }
    console.log('Oidc initialized', this._config);
  }

  get name() {
    return this._name;
  }

  get config() {
    return this._config;
  }

  getAuthorizeLink(params) {
    return getAuthorizeLink(this._config, params);
  }

  handleCallback(url) {
    return handleCallback(this._config, url);
  }

  tryLogin(params) {
    return tryLogin(this._config, params);
  }

  initSessionState(onChanged, onUnchanged, onError) {
    return initSessionState(this._config, onChanged, onUnchanged, onError);
  }

  static getTokenPayload(token) {
    return getTokenPayload(token);
  }

  static isTokenNotExpired(token) {
    return isNotExpired(token);
  }
}

export default Oidc;
