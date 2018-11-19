/* used for iFrame flows to prevent clashes */
class CustomStorage {

  constructor() {
    this._store = {};
  }

  setItem(key, value) {
    this._store[key] = value;
  };

  getItem(key) {
    return this._store[key];
  };

  removeItem(key) {
    delete this._store[key];
  };

}

export default CustomStorage;
