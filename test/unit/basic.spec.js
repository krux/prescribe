/* eslint dot-notation: [2, { "allowKeywords": true }], no-unused-expressions: 0 */

import HtmlParser from '../../src/HtmlParser';

describe('HtmlParser', () => {
  describe('#constructor', () => {
    it('constructs', () => {
      const parser = new HtmlParser('input', {});
      expect(parser).to.be.ok;
      expect(parser).to.have.property('stream', 'input');
    });
  });
});
