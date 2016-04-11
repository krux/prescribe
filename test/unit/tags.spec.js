import {testParse, parses, fixes} from '../helpers/testParse';

describe('HtmlParser (tags)', () => {
  describe('#readToken', () => {
    it('parses lower case tags', parses('<img src="http://localhost/">', (tok, str) => {
      expect(tok).to.have.property('tagName', 'img');
      expect(tok).to.have.property('type', 'startTag');
      expect(tok).to.have.property('text', '<img src="http://localhost/">');
      expect(tok).to.have.property('rest', '');
      expect(tok).to.have.property('unary', false);
      expect(tok).to.have.property('length', 29);
      expect(str).to.equal('<img src="http://localhost/">');
    }));

    it('parses upper case tags', parses('<IMG src="http://localhost/">', (tok, str) => {
      expect(tok).to.have.property('tagName', 'IMG');
      expect(tok).to.have.property('type', 'startTag');
      expect(tok).to.have.property('text', '<IMG src="http://localhost/">');
      expect(tok).to.have.property('rest', '');
      expect(tok).to.have.property('unary', false);
      expect(tok).to.have.property('length', 29);
      expect(str).to.equal('<IMG src="http://localhost/">');
    }));

    it('parses closed unary tags', () => {
      let [tok, str, parser] = testParse('<embed></embed>', {});
      expect(tok).to.have.property('tagName', 'embed');
      expect(tok).to.have.property('type', 'startTag');
      expect(tok).to.have.property('text', '<embed>');
      expect(tok).to.have.property('rest', '');
      expect(tok).to.have.property('unary', false);
      expect(tok).to.have.property('length', 7);
      expect(str).to.equal('<embed>');

      [tok, str, parser] = testParse(parser);
      expect(tok).to.have.property('tagName', 'embed');
      expect(tok).to.have.property('type', 'endTag');
      expect(tok).to.have.property('text', '</embed>');
      expect(tok).to.have.property('length', 8);
      expect(tok).to.not.have.property('rest');
      expect(tok).to.not.have.property('unary');
      expect(str).to.equal('</embed>');
    });

    it('parses closed tags', () => {
      let [tok, str, parser] = testParse('<div></div>', {});
      expect(tok).to.have.property('tagName', 'div');
      expect(tok).to.have.property('type', 'startTag');
      expect(tok).to.have.property('text', '<div>');
      expect(tok).to.have.property('rest', '');
      expect(tok).to.have.property('unary', false);
      expect(tok).to.have.property('length', 5);
      expect(str).to.equal('<div>');

      [tok, str, parser] = testParse(parser);
      expect(tok).to.have.property('tagName', 'div');
      expect(tok).to.have.property('type', 'endTag');
      expect(tok).to.have.property('text', '</div>');
      expect(tok).to.have.property('length', 6);
      expect(tok).to.not.have.property('rest');
      expect(tok).to.not.have.property('unary');
      expect(str).to.equal('</div>');
    });

    it('parses mismatched closed tags', () => {
      let [tok, str, parser] = testParse('<div></DIV>', {});
      expect(tok).to.have.property('tagName', 'div');
      expect(tok).to.have.property('type', 'startTag');
      expect(tok).to.have.property('text', '<div>');
      expect(tok).to.have.property('rest', '');
      expect(tok).to.have.property('unary', false);
      expect(tok).to.have.property('length', 5);
      expect(str).to.equal('<div>');

      [tok, str, parser] = testParse(parser);
      expect(tok).to.have.property('tagName', 'DIV');
      expect(tok).to.have.property('type', 'endTag');
      expect(tok).to.have.property('text', '</DIV>');
      expect(tok).to.have.property('length', 6);
      expect(tok).to.not.have.property('rest');
      expect(tok).to.not.have.property('unary');
      expect(str).to.equal('</DIV>');
    });

    it('fixes missing end tag', fixes('<div><i></div>foo', s => {
      expect(s).to.equal('<div><i></i></div>foo');
    }));

    it('fixes nested missing end tag', fixes('<div><i><div>foo</div><div><i>', s => {
      expect(s).to.equal('<div><i><div>foo</div><div><i>');
    }));

    it('fixes missing end tag', fixes('<div><i></div><div>foo', s => {
      expect(s).to.equal('<div><i></i></div><div>foo');
    }));

    it('fixes missing start tag', fixes('</i>foo', s => {
      expect(s).to.equal('foo');
    }));

    it('fixes multiple missing tags', fixes('<div><i></div><div>foo<i></div>bar', s => {
      expect(s).to.equal('<div><i></i></div><div>foo<i></i></div>bar');
    }));

    it('fixes multiple nested mismatching tags', fixes('<div><b><i></div>foo<div>bar<i></b>bla', s => {
      expect(s).to.equal('<div><b><i></i></b></div>foo<div>bar<i></i></div>bla');
    }));
  });
});
