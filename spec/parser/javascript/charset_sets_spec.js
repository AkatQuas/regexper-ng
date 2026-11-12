import javascript from '../../../src/js/parser/javascript/parser.js';
import Parser from '../../../src/js/parser/javascript.js';
import Node from '../../../src/js/parser/javascript/node.js';

describe('parser/javascript unicode sets charset', function () {
  beforeEach(function () {
    Node.state = {};
  });

  it('parses intersection in v mode', function () {
    const parsed = javascript.parse('/[\\w&&\\d]/v');

    expect(parsed.properties.regexp.textValue).toEqual('[\\w&&\\d]');
  });

  it('parses chained intersection in v mode', function () {
    const parsed = javascript.parse('/[a&&b&&c]/v');

    expect(parsed.properties.regexp.textValue).toEqual('[a&&b&&c]');
  });

  it('parses subtraction in v mode', function () {
    const parsed = javascript.parse('/[\\w--_]/v');

    expect(parsed.properties.regexp.textValue).toEqual('[\\w--_]');
  });

  it('parses chained subtraction in v mode', function () {
    const parsed = javascript.parse('/[[a-z]--[aeiou]--[b]]/v');

    expect(parsed.properties.regexp.textValue).toEqual('[[a-z]--[aeiou]--[b]]');
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

  it('rejects mixed set operators', function () {
    expect(() => javascript.parse('/[\\w&&\\d--_]/v')).toThrow();
  });

  it('rejects a range used directly as a set operand', function () {
    expect(() => javascript.parse('/[a-z--0-9]/v')).toThrow();
  });

  it('rejects reserved double punctuators', function () {
    expect(() => javascript.parse('/[a!!]/v')).toThrow();
  });

  it('renders chained intersection and subtraction in v mode', function (done) {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const parser = new Parser(container);

    parser
      .parse('/[[a-z]--[aeiou]--[b]]/v')
      .then((instance) => instance.render())
      .then(() => {
        const svg = container.querySelector('svg');

        expect(svg.getAttribute('width')).toBeTruthy();
        expect(svg.textContent).toContain('Except:');
        done();
      })
      .catch(done.fail)
      .then(() => {
        container.remove();
      });
  });
});
