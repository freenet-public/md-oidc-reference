/* global describe, it, before */

import chai from 'chai';
import Oidc from '../lib/md-oidc-js.js';

chai.expect();

const expect = chai.expect;

let lib;

describe('Given an instance of my Oidc library', () => {
  before(() => {
    lib = new Oidc();
  });
  describe('when I need the name', () => {
    it('should return the name', () => {
      expect(lib.name).to.be.equal('Oidc');
    });
  });
});
