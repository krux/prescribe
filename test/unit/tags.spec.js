import {testParse, parses, fixes, parsesCompletely} from '../helpers/testParse';

describe('HtmlParser (tags)', () => {
  describe('#readToken', () => {
    it('parses closed div tag completely', parsesCompletely('<div id="foo">hi there</div>', s => {
      expect(s).to.equal('<div id="foo">hi there</div>');
    }));

    it('parses closed script tag completely', parsesCompletely('<script id="foo" type="text/javascript">// hi there</script>', s => {
      expect(s).to.equal('<script id="foo" type="text/javascript">// hi there</script>');
    }));

    it('parses closed style tag completely', parsesCompletely('<style id="foo" type="text/css">/* hi there */</style>', s => {
      expect(s).to.equal('<style id="foo" type="text/css">/* hi there */</style>');
    }));

    it('parses open div tag completely', parsesCompletely('<div id="foo">hi there', s => {
      expect(s).to.equal('<div id="foo">hi there');
    }));

    it('parses open script tag completely', parsesCompletely('<script id="foo" text="text/javascript">// hi there', s => {
      expect(s).to.equal('');
    }));

    it('parses open style tag completely', parsesCompletely('<style id="foo" text="text/css">/* hi there */', s => {
      expect(s).to.equal('');
    }));

    it('parses open SCRIPT tag completely', parsesCompletely('<SCRIPT id="foo" text="text/javascript">// hi there', s => {
      expect(s).to.equal('');
    }));

    it('parses open STYLE tag completely', parsesCompletely('<STYLE id="foo" text="text/css">/* hi there */', s => {
      expect(s).to.equal('');
    }));

    it('parses closed FB tags completely', parsesCompletely('<fb:ad placementid="1234" format="320x50" testmode="true">FB</fb:ad>', s => {
      expect(s).to.equal('<fb:ad placementid="1234" format="320x50" testmode="true">FB</fb:ad>');
    }));

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
      let [tok, str, parser] = testParse('<embed></embed>');
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
      let [tok, str, parser] = testParse('<div></div>');
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
      let [tok, str, parser] = testParse('<div></DIV>');
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

    it('recovers from broken html', fixes('<div> hello <br \\="" /> </div><h2>Example</h2>', s => {
      expect(s).to.equal('<div> hello br \\="" /> </div><h2>Example</h2>');
    }));

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

    it('handles tag', parsesCompletely('<div id="remote">foo</div>', s => {
      expect(s).to.equal('<div id="remote">foo</div>');
    }));

    it('handles broken tags', parsesCompletely('<img src"abc.jpg"><div>WORKS</div>', s => {
      expect(s).to.equal('<img src"abc.jpg"><div>WORKS</div>');
    }));

    it('handles script', parsesCompletely('<div>A<script type=\"text/javascript\">document.write(\"B</div>C\");\n</script>B</div>CD', s => {
      expect(s).to.equal('<div>A<script type=\"text/javascript\">document.write(\"B</div>C\");\n</script>B</div>CD');
    }));

    it('handles two inline scripts', parsesCompletely('<script>var QWVES = 17;</script><script>document.write(QWVES);</script>', s => {
      expect(s).to.equal('<script>var QWVES = 17;</script><script>document.write(QWVES);</script>');
    }));

    it('handles atomic tags', parsesCompletely(['<script src="remote/write-remote-and-inline-script.js"></script>',
      'A<script src="remote/write-remote-and-inline-script.js">',
      '</script>B',
      '<script src="remote/write-remote-and-inline-script.js"></script>'].join(''), s => {
        expect(s).to.equal('<script src="remote/write-remote-and-inline-script.js"></script>A' +
          '<script src="remote/write-remote-and-inline-script.js"></script>B' +
          '<script src="remote/write-remote-and-inline-script.js"></script>');
      }));
  });
});
