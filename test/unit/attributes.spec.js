import {parses} from '../helpers/testParse';

describe('HtmlParser', () => {
  describe('#readToken', () => {
    it('parses double quoted attributes', parses('<img src="http://localhost/">', (tok, str) => {
      expect(tok).to.have.property('tagName', 'img');
      expect(tok).to.have.property('rest', '');
      expect(tok).to.have.property('unary', false);
      expect(tok).to.have.property('length', 29);
      expect(tok).to.have.property('type', 'startTag');
      expect(tok).to.have.property('text', '<img src="http://localhost/">');
      expect(tok).to.have.property('attrs');
      expect(tok.attrs).to.have.property('src', 'http://localhost/');
      expect(tok).to.have.property('booleanAttrs');
      expect(tok.booleanAttrs).to.be.empty();

      expect(str).to.equal('<img src="http://localhost/">');
    }));

    it('parses single quoted attributes', parses('<img src=\'http://localhost/\'>', (tok, str) => {
      expect(tok).to.have.property('tagName', 'img');
      expect(tok).to.have.property('rest', '');
      expect(tok).to.have.property('unary', false);
      expect(tok).to.have.property('length', 29);
      expect(tok).to.have.property('type', 'startTag');
      expect(tok).to.have.property('text', '<img src=\'http://localhost/\'>');
      expect(tok).to.have.property('attrs');
      expect(tok.attrs).to.have.property('src', 'http://localhost/');
      expect(tok).to.have.property('booleanAttrs');
      expect(tok.booleanAttrs).to.be.empty();

      expect(str).to.equal('<img src="http://localhost/">');
    }));

    it('parses unquoted attributes', parses('<img src=http://localhost/>', (tok, str) => {
      expect(tok).to.have.property('tagName', 'img');
      expect(tok).to.have.property('rest', '');
      expect(tok).to.have.property('unary', false);
      expect(tok).to.have.property('length', 27);
      expect(tok).to.have.property('type', 'startTag');
      expect(tok).to.have.property('text', '<img src=http://localhost/>');
      expect(tok).to.have.property('attrs');
      expect(tok.attrs).to.have.property('src', 'http://localhost/');
      expect(tok).to.have.property('booleanAttrs');
      expect(tok.booleanAttrs).to.be.empty();

      expect(str).to.equal('<img src="http://localhost/">');
    }));

    it('parses empty attributes', parses('<img src="">', (tok, str) => {
      expect(tok).to.have.property('tagName', 'img');
      expect(tok).to.have.property('rest', '');
      expect(tok).to.have.property('unary', false);
      expect(tok).to.have.property('length', 12);
      expect(tok).to.have.property('type', 'startTag');
      expect(tok).to.have.property('text', '<img src="">');
      expect(tok).to.have.property('attrs');
      expect(tok.attrs).to.have.property('src', '');
      expect(tok).to.have.property('booleanAttrs');
      expect(tok.booleanAttrs).to.be.empty();

      expect(str).to.equal('<img src="">');
    }));

    it('parses missing equal attributes', parses('<img src"">', (tok, str) => {
      expect(tok).to.have.property('tagName', 'img');
      expect(tok).to.have.property('rest', 'src""');
      expect(tok).to.have.property('unary', false);
      expect(tok).to.have.property('length', 11);
      expect(tok).to.have.property('type', 'startTag');
      expect(tok).to.have.property('text', '<img src"">');
      expect(tok).to.have.property('attrs');
      expect(tok.attrs).to.be.empty();
      expect(tok).to.have.property('booleanAttrs');
      expect(tok.booleanAttrs).to.be.empty();

      expect(str).to.equal('<img src"">');
    }));

    it('parses boolean attributes', parses('<input type="checkbox" checked>', (tok, str) => {
      expect(tok).to.have.property('tagName', 'input');
      expect(tok).to.have.property('rest', '');
      expect(tok).to.have.property('unary', false);
      expect(tok).to.have.property('length', 31);
      expect(tok).to.have.property('type', 'startTag');
      expect(tok).to.have.property('text', '<input type="checkbox" checked>');
      expect(tok).to.have.property('attrs');
      expect(tok.attrs).to.have.property('type', 'checkbox');
      expect(tok).to.have.property('booleanAttrs');
      expect(tok.booleanAttrs).to.have.property('checked', true);

      expect(str).to.equal('<input type="checkbox" checked>');
    }));

    it('parses self closing tags', parses('<div class="foo"/>', (tok, str) => {
      expect(tok).to.have.property('tagName', 'div');
      expect(tok).to.have.property('rest', '');
      expect(tok).to.have.property('unary', true);
      expect(tok).to.have.property('length', 18);
      expect(tok).to.have.property('type', 'startTag');
      expect(tok).to.have.property('text', '<div class="foo"/>');
      expect(tok).to.have.property('attrs');
      expect(tok.attrs).to.have.property('class', 'foo');

      expect(str).to.equal('<div class="foo"/>');
    }));

    it('parses escaped quotes', parses("<iframe onload='var s=\"\";'></iframe>", (tok, str) => {
      expect(tok).to.have.property('tagName', 'iframe');
      expect(tok.attrs).to.have.property('onload', 'var s="";');
      expect(str).to.equal('<iframe onload="var s=\\"\\";"></iframe>');
    }));
  });

});
