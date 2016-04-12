import HtmlParser from '../../src/HtmlParser';

describe('HtmlParser', () => {
  describe('#constructor', () => {
    it('constructs', () => {
      const parser = new HtmlParser('input', {});
      expect(parser).to.be.ok();
      expect(parser).to.have.property('stream', 'input');
    });
  });
});
