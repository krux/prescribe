/* globals expect */
/* eslint dot-notation: [2, { "allowKeywords": true }], no-unused-expressions: 0 */

import * as streamReaders from '../../src/streamReaders';

describe('streamReaders', () => {
  describe('#comment', () => {
    it('reads comment with no remainder', () => {
      const tok = streamReaders.comment('-->');
      tok.should.have.property('content').that.is.a('string').empty;
      tok.should.have.property('length').that.is.a('Number').equals(3);
    });

    it('reads comment with remainder', () => {
      const tok = streamReaders.comment('-->foo');
      tok.should.have.property('content').that.is.a('string').empty;
      tok.should.have.property('length').that.is.a('Number').equals(3);
    });

    it('returns undefined for no comment', () => {
      const tok = streamReaders.comment('-!->');
      expect(tok).not.to.be.ok;
    });
  });

  describe('#endTag', () => {
    it('reads an end tag', () => {
      const tok = streamReaders.endTag('</div>');
      tok.should.have.property('tagName').that.is.a('string').equals('div');
      tok.should.have.property('length').that.is.a('Number').equals(6);
    });

    it('returns undefined for not an end tag', () => {
      const tok = streamReaders.endTag('<div>');
      expect(tok).not.to.be.ok;
    });
  });

  describe('#chars', () => {
    it('reads until tag start', () => {
      const tok = streamReaders.chars('foo</div>');
      tok.should.have.property('length').that.is.a('Number').equals(3);
    });

    it('consumes everything if not tag', () => {
      const tok = streamReaders.chars('foo');
      tok.should.have.property('length').that.is.a('Number').equals(3);
    });
  });

  describe('#atomicTag', () => {
    it('reads an atomic tag', () => {
      const tok = streamReaders.atomicTag('<div class="foo">content</div>');
      tok.should.have.property('tagName').that.is.a('string').equals('div');
      tok.should.have.property('attrs').that.is.an('object')
          .that.has.property('class').equals('foo');
      tok.should.have.property('content').that.is.a('string').equals('content');
      tok.should.have.property('length').that.is.a('Number').equals(30);
    });

    it('returns undefined for a broken atomic tag', () => {
      const tok = streamReaders.atomicTag('<b class="foo">content</i>');
      expect(tok).not.to.be.ok;
    });
  });

  describe('#startTag', () => {
    it('reads a start tag', () => {
      const tok = streamReaders.startTag('<b class="foo">content</b>');
      tok.should.have.property('tagName').that.is.a('string').equals('b');
      tok.should.have.property('attrs').that.is.an('object')
          .that.has.property('class').equals('foo');
      tok.should.have.property('booleanAttrs').that.is.an('object').empty;
      tok.should.have.property('rest').that.is.a('string').empty;
      tok.should.have.property('unary').that.is.a('boolean').false;
      tok.should.have.property('length').that.is.a('Number').equals(15);
    });

    it('returns undefined for not a start tag', () => {
      const tok = streamReaders.startTag('</foo>');
      expect(tok).not.to.be.ok;
    });
  });

});
