function getTokenPayload(token) {
  const jwtParts = token.split('.');

  // return payload (Only works for unencrypted JWTs)
  return JSON.parse(atob(jwtParts[1]));
}

function isNotExpired(token) {
  if (!token) {
    return false;
  }
  if (typeof (token) !== 'object') {
    token = getTokenPayload(token);
  }
  if (token && token.exp) {
    return Date.now() < (token.exp * 1000);
  }
  return false;
}

export {
  getTokenPayload,
  isNotExpired
};
