/* eslint dot-notation: [2, { "allowKeywords": true }], no-unused-expressions: 0 */

import {testParse, parses} from '../helpers/testParse';

describe('HtmlParser (tags)', () => {
  describe('#readToken', () => {
    it('parses lower case tags', parses('<img src="http://localhost/">', (tok, str) => {
      tok.should.have.property('tagName').that.is.a('string').equals('img');
      tok.should.have.property('type').that.is.a('string').equals('startTag');
      tok.should.have.property('text').that.is.a('string').equals('<img src="http://localhost/">');
      tok.should.have.property('rest').that.is.a('string').empty;
      tok.should.have.property('unary').that.is.a('boolean').false;
      tok.should.have.property('length').that.is.a('Number').equals(29);
      str.should.equal('<img src="http://localhost/">');
    }));

    it('parses upper case tags', parses('<IMG src="http://localhost/">', (tok, str) => {
      tok.should.have.property('tagName').that.is.a('string').equals('IMG');
      tok.should.have.property('type').that.is.a('string').equals('startTag');
      tok.should.have.property('text').that.is.a('string').equals('<IMG src="http://localhost/">');
      tok.should.have.property('rest').that.is.a('string').empty;
      tok.should.have.property('unary').that.is.a('boolean').false;
      tok.should.have.property('length').that.is.a('Number').equals(29);
      str.should.equal('<IMG src="http://localhost/">');
    }));

    it('parses closed unary tags', () => {
      let [tok, str, parser] = testParse('<embed></embed>', {});
      tok.should.have.property('tagName').that.is.a('string').equals('embed');
      tok.should.have.property('type').that.is.a('string').equals('startTag');
      tok.should.have.property('text').that.is.a('string').equals('<embed>');
      tok.should.have.property('rest').that.is.a('string').empty;
      tok.should.have.property('unary').that.is.a('boolean').false;
      tok.should.have.property('length').that.is.a('Number').equals(7);
      str.should.equal('<embed>');

      [tok, str, parser] = testParse(parser);
      tok.should.have.property('tagName').that.is.a('string').equals('embed');
      tok.should.have.property('type').that.is.a('string').equals('endTag');
      tok.should.have.property('text').that.is.a('string').equals('</embed>');
      tok.should.have.property('length').that.is.a('Number').equals(8);
      tok.should.not.have.property('rest');
      tok.should.not.have.property('unary');
      str.should.equal('</embed>');
    });

    it('parses closed tags', () => {
      let [tok, str, parser] = testParse('<div></div>', {});
      tok.should.have.property('tagName').that.is.a('string').equals('div');
      tok.should.have.property('type').that.is.a('string').equals('startTag');
      tok.should.have.property('text').that.is.a('string').equals('<div>');
      tok.should.have.property('rest').that.is.a('string').empty;
      tok.should.have.property('unary').that.is.a('boolean').false;
      tok.should.have.property('length').that.is.a('Number').equals(5);
      str.should.equal('<div>');

      [tok, str, parser] = testParse(parser);
      tok.should.have.property('tagName').that.is.a('string').equals('div');
      tok.should.have.property('type').that.is.a('string').equals('endTag');
      tok.should.have.property('text').that.is.a('string').equals('</div>');
      tok.should.have.property('length').that.is.a('Number').equals(6);
      tok.should.not.have.property('rest');
      tok.should.not.have.property('unary');
      str.should.equal('</div>');
    });

    it('parses mismatched closed tags', () => {
      let [tok, str, parser] = testParse('<div></DIV>', {});
      tok.should.have.property('tagName').that.is.a('string').equals('div');
      tok.should.have.property('type').that.is.a('string').equals('startTag');
      tok.should.have.property('text').that.is.a('string').equals('<div>');
      tok.should.have.property('rest').that.is.a('string').empty;
      tok.should.have.property('unary').that.is.a('boolean').false;
      tok.should.have.property('length').that.is.a('Number').equals(5);
      str.should.equal('<div>');

      [tok, str, parser] = testParse(parser);
      tok.should.have.property('tagName').that.is.a('string').equals('DIV');
      tok.should.have.property('type').that.is.a('string').equals('endTag');
      tok.should.have.property('text').that.is.a('string').equals('</DIV>');
      tok.should.have.property('length').that.is.a('Number').equals(6);
      tok.should.not.have.property('rest');
      tok.should.not.have.property('unary');
      str.should.equal('</DIV>');
    });
  });
});
