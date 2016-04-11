/* eslint dot-notation: [2, { "allowKeywords": true }], no-unused-expressions: 0 */

import HtmlParser from '../../src/HtmlParser';

describe('HtmlParser', () => {
  describe('#constructor', () => {
    it('constructs', () => {
      const parser = new HtmlParser('input', {});
      parser.should.be.ok;
      parser.should.have.property('stream').that.is.a('string').equals('input');
    });
  });
});
