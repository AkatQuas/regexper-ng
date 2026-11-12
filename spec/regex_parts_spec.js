import javascript from '../src/js/parser/javascript/parser.js';
import Node from '../src/js/parser/javascript/node.js';
import { regexModes, splitRegexLiteral } from '../src/js/regex_parts.js';

describe('regex flags and unicode escapes', function () {
  beforeEach(function () {
    Node.state = {};
  });

  it('rejects duplicate flags', function () {
    expect(() => splitRegexLiteral('/a/gg')).toThrowError(/Duplicate flag: g/);
  });

  it('rejects combining u and v', function () {
    expect(() => splitRegexLiteral('/a/uv')).toThrowError(/cannot be combined/);
  });

  it('records dotAll and multiline from flags', function () {
    expect(regexModes('sm')).toEqual(jasmine.objectContaining({
      dotAll: true,
      multiline: true,
      unicodeMode: false,
    }));
  });

  it('rejects property escapes without a unicode flag', function () {
    expect(() => javascript.parse('\\p{L}')).toThrow('Invalid property escape: \\p{L}');
  });

  it('parses property escapes with the u flag', function () {
    expect(() => javascript.parse('/\\p{L}/u')).not.toThrow();
  });

  it('rejects octal escapes in unicode mode', function () {
    expect(() => javascript.parse('/\\012/u')).toThrow('Invalid octal escape: \\012');
  });

  it('rejects decimal escapes in unicode mode', function () {
    expect(() => javascript.parse('/\\8/u')).toThrow('Invalid escape: \\8');
  });

  it('rejects code points past U+10FFFF', function () {
    expect(() => javascript.parse('\\u{110000}')).toThrow('Invalid Unicode escape: \\u{110000}');
  });

  it('accepts a unicode named group and its backreference', function () {
    expect(() => javascript.parse('(?<名字>a)\\k<名字>')).not.toThrow();
  });
});
