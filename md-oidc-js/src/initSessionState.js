/* Session State */
import $ from 'jQuery';
import clearAuthentication from './util/clearAuthentication';

const initSessionState = (function () {

  let sessionStateInit = false;

  return function (config, onChanged, onUnchanged, onError) {

    let verifySessionID;

    /* Function called to verify the session state, used by setInterval */
    function verifySession() {

      let targetWindow;

      return function () {
        if (!targetWindow) {
          targetWindow = document.getElementById('session-state-iframe').contentWindow;
        }
        // get the session state
        let sessionState = sessionStorage.getItem('session_state');
        // Compose the message
        let message = config.clientId + ' ' + sessionState;

        // Post the message to the OpenID provider iframe
        targetWindow.postMessage(message, config.oidcOrigin);
      };

    }

    /* function called when session state has changed */
    function remove(listener) {
      if (!sessionStateInit) return console.log('sessionState#remove: Session state not initialized!');
      clearInterval(verifySessionID);
      $('#session-state-iframe').remove();
      window.removeEventListener('message', listener, false);
      // clear local storage
      clearAuthentication();
      sessionStateInit = false;
      return console.log('sessionState#remove: Authentication data cleared');
    }

    /* callback function for session state iframe callback */
    function receiveMessage(event) {

      if (event.origin !== config.oidcOrigin) {
        console.log('sessionState#receiveMessage: Received message from wrong origin, ignoring', event.origin);
        return;
      }

      switch (event && event.data) {
        case 'changed':
          remove(receiveMessage);
          onChanged && onChanged();
          break;
        case 'unchanged':
          onUnchanged && onUnchanged();
          break;
        case 'error':
          onError && onError();
          break;
      }
      // if none of the above the message is not from sessionState iFrame
    }

    if (sessionStateInit) {
      return console.log('sessionState#init: Session state already initialized!');
    }
    sessionStateInit = true;
    const checkInterval = config.checkInterval ? config.checkInterval * 1000 : 2000; // defaults to 2 seconds
    const revalidate = config.revalidate || 20; // defaults to 20 seconds
    const src = `${config.oidcBaseUrl}/sessionState.html?revalidate=${revalidate}`;

    $('body').append(`<iframe id='session-state-iframe' src='${src}' style='display: none'/>`);
    window.addEventListener('message', receiveMessage, false);
    verifySessionID = setInterval(verifySession(), checkInterval);
    return true;
  };
}());

export default initSessionState;
