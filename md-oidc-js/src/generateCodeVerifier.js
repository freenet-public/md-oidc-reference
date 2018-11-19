function generateRandomData(len) {
  // use web crypto APIs if possible
  let array = null;
  let crypto = window.crypto || window.msCrypto;

  if (crypto && crypto.getRandomValues && window.Uint8Array) {
    array = new Uint8Array(len);
    crypto.getRandomValues(array);
    return array;
  }

  // fallback to Math random
  array = [];
  for (let j = 0; j < array.length; j++) {
    array[j] = Math.floor(256 * Math.random());
  }
  return array;
}

function generateCodeVerifier(len) {
  let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomData = generateRandomData(len);
  let chars = [];

  for (let i = 0; i < len; i++) {
    chars[i] = alphabet.charCodeAt(randomData[i] % alphabet.length);
  }
  return String.fromCharCode.apply(null, chars);
}

export default generateCodeVerifier;
