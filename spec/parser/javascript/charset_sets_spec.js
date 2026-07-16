import javascript from '../../../src/js/parser/javascript/parser.js';
import Parser from '../../../src/js/parser/javascript.js';

describe('parser/javascript unicode sets charset', function () {
  it('parses intersection in v mode', function () {
    const parsed = javascript.parse('/[\\w&&\\d]/v');

    expect(parsed.properties.regexp.textValue).toEqual('[\\w&&\\d]');
  });

  it('parses subtraction in v mode', function () {
    const parsed = javascript.parse('/[\\w--_]/v');

    expect(parsed.properties.regexp.textValue).toEqual('[\\w--_]');
  });

  it('parses string literals in v mode', function () {
    const parser = new javascript.SetsParser('[\\q{ab|c}]');

    expect(parser.__consume__charset()).toEqual(
      jasmine.objectContaining({
        type: 'charset',
      })
    );
  });

  it('parses nested classes in v mode', function () {
    const parsed = javascript.parse('/[[a-z]&&\\d]/v');

    expect(parsed.properties.regexp.textValue).toEqual('[[a-z]&&\\d]');
  });

  it('renders intersection and subtraction in v mode', function (done) {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const parser = new Parser(container);

    parser
      .parse('/[\\w&&\\d--_]/v')
      .then((instance) => instance.render())
      .then(() => {
        const svg = container.querySelector('svg');

        expect(svg.getAttribute('width')).toBeTruthy();
        expect(svg.querySelectorAll('path').length).toBeGreaterThan(0);
        done();
      })
      .catch(done.fail)
      .then(() => {
        container.remove();
      });
  });
});
