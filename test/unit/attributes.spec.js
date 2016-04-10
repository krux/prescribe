/* eslint dot-notation: [2, { "allowKeywords": true }], no-unused-expressions: 0 */

import testParse from '../helpers/testParse';

describe('HtmlParser', () => {
  describe('#readToken', () => {
    it('parses double quoted attributes', () => {
      const [tok, str] = testParse('<img src="http://localhost/">', {});
      tok.should.have.property('tagName').that.is.a('string').equals('img');
      tok.should.have.property('rest').that.is.a('string').empty;
      tok.should.have.property('unary').that.is.a('boolean').false;
      tok.should.have.property('length').that.is.a('Number').equals(29);
      tok.should.have.property('type').that.is.a('string').equals('startTag');
      tok.should.have.property('text').that.is.a('string').equals('<img src="http://localhost/">');
      tok.should.have.property('attrs').that.is.an('object').that.has.property('src').that.is.a('string').equals('http://localhost/');
      tok.should.have.property('booleanAttrs').that.is.an('object').empty;

      str.should.equal('<img src="http://localhost/">');
    });

    it('parses single quoted attributes', () => {
      const [tok, str] = testParse('<img src=\'http://localhost/\'>', {});
      tok.should.have.property('tagName').that.is.a('string').equals('img');
      tok.should.have.property('rest').that.is.a('string').empty;
      tok.should.have.property('unary').that.is.a('boolean').false;
      tok.should.have.property('length').that.is.a('Number').equals(29);
      tok.should.have.property('type').that.is.a('string').equals('startTag');
      tok.should.have.property('text').that.is.a('string').equals('<img src=\'http://localhost/\'>');
      tok.should.have.property('attrs').that.is.an('object').that.has.property('src').that.is.a('string').equals('http://localhost/');
      tok.should.have.property('booleanAttrs').that.is.an('object').empty;

      str.should.equal('<img src="http://localhost/">');
    });

    it('parses unquoted attributes', () => {
      const [tok, str] = testParse('<img src=http://localhost/>', {});
      tok.should.have.property('tagName').that.is.a('string').equals('img');
      tok.should.have.property('rest').that.is.a('string').empty;
      tok.should.have.property('unary').that.is.a('boolean').false;
      tok.should.have.property('length').that.is.a('Number').equals(27);
      tok.should.have.property('type').that.is.a('string').equals('startTag');
      tok.should.have.property('text').that.is.a('string').equals('<img src=http://localhost/>');
      tok.should.have.property('attrs').that.is.an('object').that.has.property('src').that.is.a('string').equals('http://localhost/');
      tok.should.have.property('booleanAttrs').that.is.an('object').empty;

      str.should.equal('<img src="http://localhost/">');
    });

    it('parses empty attributes', () => {
      const [tok, str] = testParse('<img src="">', {});
      tok.should.have.property('tagName').that.is.a('string').equals('img');
      tok.should.have.property('rest').that.is.a('string').empty;
      tok.should.have.property('unary').that.is.a('boolean').false;
      tok.should.have.property('length').that.is.a('Number').equals(12);
      tok.should.have.property('type').that.is.a('string').equals('startTag');
      tok.should.have.property('text').that.is.a('string').equals('<img src="">');
      tok.should.have.property('attrs').that.is.an('object').that.has.property('src').that.is.a('string').equals('');
      tok.should.have.property('booleanAttrs').that.is.an('object').empty;

      str.should.equal('<img src="">');
    });

    it.skip('parses missing equal attributes', () => {
      const [tok, str] = testParse('<img src"">', {});
      tok.should.have.property('tagName').that.is.a('string').equals('img');
      tok.should.have.property('rest').that.is.a('string').empty;
      tok.should.have.property('unary').that.is.a('boolean').false;
      tok.should.have.property('length').that.is.a('Number').equals(11);
      tok.should.have.property('type').that.is.a('string').equals('startTag');
      tok.should.have.property('text').that.is.a('string').equals('<img src"">');
      tok.should.have.property('attrs').that.is.an('object').that.has.property('src').that.is.a('string').equals('');
      tok.should.have.property('booleanAttrs').that.is.an('object').empty;

      str.should.equal('<img src="">');
    });

    it('parses boolean attributes', () => {
      const [tok, str] = testParse('<input type="checkbox" checked>', {});
      tok.should.have.property('tagName').that.is.a('string').equals('input');
      tok.should.have.property('rest').that.is.a('string').empty;
      tok.should.have.property('unary').that.is.a('boolean').false;
      tok.should.have.property('length').that.is.a('Number').equals(31);
      tok.should.have.property('type').that.is.a('string').equals('startTag');
      tok.should.have.property('text').that.is.a('string').equals('<input type="checkbox" checked>');
      tok.should.have.property('attrs').that.is.an('object')
          .that.has.property('type').that.is.a('string').equals('checkbox');
      tok.should.have.property('booleanAttrs').that.is.an('object')
          .that.has.property('checked').that.is.a('boolean').equals(true);

      str.should.equal('<input type="checkbox" checked>');
    });

    it('parses self closing tags', () => {
      const [tok, str] = testParse('<div class="foo"/>', {});
      tok.should.have.property('tagName').that.is.a('string').equals('div');
      tok.should.have.property('rest').that.is.a('string').empty;
      tok.should.have.property('unary').that.is.a('boolean').true;
      tok.should.have.property('length').that.is.a('Number').equals(18);
      tok.should.have.property('type').that.is.a('string').equals('startTag');
      tok.should.have.property('text').that.is.a('string').equals('<div class="foo"/>');
      tok.should.have.property('attrs').that.is.an('object')
          .that.has.property('class').that.is.a('string').equals('foo');

      str.should.equal('<div class="foo"/>');
    });
  });

});
