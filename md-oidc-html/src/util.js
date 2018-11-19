// Check if running in iFrame
import $ from 'jquery';
import { checkAuthenticating } from './authentication';

function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

// Hilfsfunktion für Login-Buttons
function onAuthorizeLinkClick(mdoidc, params) {
  return function (e) {
    $(this).prop('href', mdoidc.getAuthorizeLink(params));
    return checkAuthenticating(e);
  };
}

export {
  inIframe,
  onAuthorizeLinkClick
};
