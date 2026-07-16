import Snap from 'snapsvg';
import javascript from '../../../src/js/parser/javascript/parser.js';

describe('parser/javascript/surrogate_escape.js', function () {
  it('parses a surrogate pair escape', function () {
    const parser = new javascript.Parser('\\uD800\\uDC00');

    expect(parser.__consume__terminal()).toEqual(
      jasmine.objectContaining({
        type: 'surrogate-escape',
        label: 'U+10000',
      })
    );
  });

  describe('#_render', function () {
    beforeEach(function () {
      const parser = new javascript.Parser('\\uD800\\uDC00');
      this.node = parser.__consume__terminal();
      this.node.state = {};

      this.svg = Snap(document.createElement('svg'));
      this.node.container = this.svg.group();
      spyOn(this.node, 'renderLabel').and.callThrough();
    });

    it('renders a label', function () {
      this.node._render();

      expect(this.node.renderLabel).toHaveBeenCalledWith('U+10000');
    });
  });
});
