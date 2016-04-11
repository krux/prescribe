/* globals expect */
/* eslint dot-notation: [2, { "allowKeywords": true }], no-unused-expressions: 0 */

import * as streamReaders from '../../src/streamReaders';

describe('streamReaders', () => {
  describe('#comment', () => {
    it('reads comment with no remainder', () => {
      const tok = streamReaders.comment('-->');
      expect(tok).to.have.property('content', '');
      expect(tok).to.have.property('length', 3);
    });

    it('reads comment with remainder', () => {
      const tok = streamReaders.comment('-->foo');
      expect(tok).to.have.property('content', '');
      expect(tok).to.have.property('length', 3);
    });

    it('returns undefined for no comment', () => {
      const tok = streamReaders.comment('-!->');
      expect(tok).not.to.be.ok;
    });
  });

  describe('#endTag', () => {
    it('reads an end tag', () => {
      const tok = streamReaders.endTag('</div>');
      expect(tok).to.have.property('tagName', 'div');
      expect(tok).to.have.property('length', 6);
    });

    it('returns undefined for not an end tag', () => {
      const tok = streamReaders.endTag('<div>');
      expect(tok).not.to.be.ok;
    });
  });

  describe('#chars', () => {
    it('reads until tag start', () => {
      const tok = streamReaders.chars('foo</div>');
      expect(tok).to.have.property('length', 3);
    });

    it('consumes everything if not tag', () => {
      const tok = streamReaders.chars('foo');
      expect(tok).to.have.property('length', 3);
    });
  });

  describe('#atomicTag', () => {
    it('reads an atomic tag', () => {
      const tok = streamReaders.atomicTag('<div class="foo">content</div>');
      expect(tok).to.have.property('tagName', 'div');
      expect(tok).to.have.property('attrs');
      expect(tok.attrs).to.have.property('class', 'foo');
      expect(tok).to.have.property('content', 'content');
      expect(tok).to.have.property('length', 30);
    });

    it('returns undefined for a broken atomic tag', () => {
      const tok = streamReaders.atomicTag('<b class="foo">content</i>');
      expect(tok).not.to.be.ok;
    });
  });

  describe('#startTag', () => {
    it('reads a start tag', () => {
      const tok = streamReaders.startTag('<b class="foo">content</b>');
      expect(tok).to.have.property('tagName', 'b');
      expect(tok).to.have.property('attrs');
      expect(tok.attrs).to.have.property('class', 'foo');
      expect(tok).to.have.property('booleanAttrs');
      expect(tok.booleanAttrs).to.be.empty;
      expect(tok).to.have.property('rest', '');
      expect(tok).to.have.property('unary', false);
      expect(tok).to.have.property('length', 15);
    });

    it('returns undefined for not a start tag', () => {
      const tok = streamReaders.startTag('</foo>');
      expect(tok).not.to.be.ok;
    });
  });

});
