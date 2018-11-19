// Removes authentication information from local storage
function clearAuthentication() {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('session_state');
}

export default clearAuthentication;
