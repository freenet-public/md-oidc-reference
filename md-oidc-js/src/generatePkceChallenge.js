import * as sha256 from 'js-sha256';
import * as base64 from 'base64-js';

function generatePkceChallenge(pkceMethod, codeVerifier) {
  switch (pkceMethod) {
    case 'lain':
      return codeVerifier;
    case 'S256':
      // hash codeVerifier, then encode as url-safe base64 without padding
      const hashBytes = new Uint8Array(sha256.arrayBuffer(codeVerifier));

      return base64.fromByteArray(hashBytes)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
    default:
      throw new Error('Invalid value for pkceMethod');
  }
}

export default generatePkceChallenge;
