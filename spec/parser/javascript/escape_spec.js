import _ from 'lodash';
import Snap from 'snapsvg';
import javascript from '../../../src/js/parser/javascript/parser.js';

describe('parser/javascript/escape.js', function () {
  _.forIn(
    {
      '\\b': { label: 'word boundary', ordinal: -1 },
      '\\B': { label: 'non-word boundary', ordinal: -1 },
      '\\d': { label: 'digit', ordinal: -1 },
      '\\D': { label: 'non-digit', ordinal: -1 },
      '\\f': { label: 'form feed (0x0C)', ordinal: 0x0c },
      '\\n': { label: 'line feed (0x0A)', ordinal: 0x0a },
      '\\r': { label: 'carriage return (0x0D)', ordinal: 0x0d },
      '\\s': { label: 'white space', ordinal: -1 },
      '\\S': { label: 'non-white space', ordinal: -1 },
      '\\t': { label: 'tab (0x09)', ordinal: 0x09 },
      '\\v': { label: 'vertical tab (0x0B)', ordinal: 0x0b },
      '\\w': { label: 'word', ordinal: -1 },
      '\\W': { label: 'non-word', ordinal: -1 },
      '\\0': { label: 'null (0x00)', ordinal: 0 },
      '\\1': { label: 'Back reference (group = 1)', ordinal: -1 },
      '\\2': { label: 'Back reference (group = 2)', ordinal: -1 },
      '\\3': { label: 'Back reference (group = 3)', ordinal: -1 },
      '\\4': { label: 'Back reference (group = 4)', ordinal: -1 },
      '\\5': { label: 'Back reference (group = 5)', ordinal: -1 },
      '\\6': { label: 'Back reference (group = 6)', ordinal: -1 },
      '\\7': { label: 'Back reference (group = 7)', ordinal: -1 },
      '\\8': { label: 'Back reference (group = 8)', ordinal: -1 },
      '\\9': { label: 'Back reference (group = 9)', ordinal: -1 },
      '\\012': { label: 'octal: 12 (0x0A)', ordinal: 10 },
      '\\cx': { label: 'ctrl-X (0x18)', ordinal: 24 },
      '\\xab': { label: '0xAB', ordinal: 0xab },
      '\\uabcd': { label: 'U+ABCD', ordinal: 0xabcd },
      '\\p{C}': { label: 'Other', ordinal: -1 },
      '\\p{Other}': { label: 'Other', ordinal: -1 },
      '\\P{C}': { label: 'non-Other', ordinal: -1 },
      '\\P{Other}': { label: 'non-Other', ordinal: -1 },
      '\\p{Cc}': { label: 'Control', ordinal: -1 },
      '\\p{Control}': { label: 'Control', ordinal: -1 },
      '\\P{Cc}': { label: 'non-Control', ordinal: -1 },
      '\\P{Control}': { label: 'non-Control', ordinal: -1 },
      '\\p{Cf}': { label: 'Format', ordinal: -1 },
      '\\p{Format}': { label: 'Format', ordinal: -1 },
      '\\P{Cf}': { label: 'non-Format', ordinal: -1 },
      '\\P{Format}': { label: 'non-Format', ordinal: -1 },
      '\\p{Cn}': { label: 'Unassigned', ordinal: -1 },
      '\\p{Unassigned}': { label: 'Unassigned', ordinal: -1 },
      '\\P{Cn}': { label: 'non-Unassigned', ordinal: -1 },
      '\\P{Unassigned}': { label: 'non-Unassigned', ordinal: -1 },
      '\\p{Co}': { label: 'Private Use', ordinal: -1 },
      '\\p{Private_Use}': { label: 'Private Use', ordinal: -1 },
      '\\P{Co}': { label: 'non-Private Use', ordinal: -1 },
      '\\P{Private_Use}': { label: 'non-Private Use', ordinal: -1 },
      '\\p{Cs}': { label: 'Surrogate', ordinal: -1 },
      '\\p{Surrogate}': { label: 'Surrogate', ordinal: -1 },
      '\\P{Cs}': { label: 'non-Surrogate', ordinal: -1 },
      '\\P{Surrogate}': { label: 'non-Surrogate', ordinal: -1 },
      '\\p{L}': { label: 'Letter', ordinal: -1 },
      '\\p{Letter}': { label: 'Letter', ordinal: -1 },
      '\\P{L}': { label: 'non-Letter', ordinal: -1 },
      '\\P{Letter}': { label: 'non-Letter', ordinal: -1 },
      '\\p{LC}': { label: 'Cased Letter', ordinal: -1 },
      '\\p{Cased_Letter}': { label: 'Cased Letter', ordinal: -1 },
      '\\P{LC}': { label: 'non-Cased Letter', ordinal: -1 },
      '\\P{Cased_Letter}': { label: 'non-Cased Letter', ordinal: -1 },
      '\\p{Ll}': { label: 'Lowercase Letter', ordinal: -1 },
      '\\p{Lowercase_Letter}': { label: 'Lowercase Letter', ordinal: -1 },
      '\\P{Ll}': { label: 'non-Lowercase Letter', ordinal: -1 },
      '\\P{Lowercase_Letter}': { label: 'non-Lowercase Letter', ordinal: -1 },
      '\\p{Lm}': { label: 'Modifier Letter', ordinal: -1 },
      '\\p{Modifier_Letter}': { label: 'Modifier Letter', ordinal: -1 },
      '\\P{Lm}': { label: 'non-Modifier Letter', ordinal: -1 },
      '\\P{Modifier_Letter}': { label: 'non-Modifier Letter', ordinal: -1 },
      '\\p{Lo}': { label: 'Other Letter', ordinal: -1 },
      '\\p{Other_Letter}': { label: 'Other Letter', ordinal: -1 },
      '\\P{Lo}': { label: 'non-Other Letter', ordinal: -1 },
      '\\P{Other_Letter}': { label: 'non-Other Letter', ordinal: -1 },
      '\\p{Lt}': { label: 'Titlecase Letter', ordinal: -1 },
      '\\p{Titlecase_Letter}': { label: 'Titlecase Letter', ordinal: -1 },
      '\\P{Lt}': { label: 'non-Titlecase Letter', ordinal: -1 },
      '\\P{Titlecase_Letter}': { label: 'non-Titlecase Letter', ordinal: -1 },
      '\\p{Lu}': { label: 'Uppercase Letter', ordinal: -1 },
      '\\p{Uppercase_Letter}': { label: 'Uppercase Letter', ordinal: -1 },
      '\\P{Lu}': { label: 'non-Uppercase Letter', ordinal: -1 },
      '\\P{Uppercase_Letter}': { label: 'non-Uppercase Letter', ordinal: -1 },
      '\\p{M}': { label: 'Mark', ordinal: -1 },
      '\\p{Mark}': { label: 'Mark', ordinal: -1 },
      '\\P{M}': { label: 'non-Mark', ordinal: -1 },
      '\\P{Mark}': { label: 'non-Mark', ordinal: -1 },
      '\\p{Mc}': { label: 'Spacing Mark', ordinal: -1 },
      '\\p{Spacing_Mark}': { label: 'Spacing Mark', ordinal: -1 },
      '\\P{Mc}': { label: 'non-Spacing Mark', ordinal: -1 },
      '\\P{Spacing_Mark}': { label: 'non-Spacing Mark', ordinal: -1 },
      '\\p{Me}': { label: 'Enclosing Mark', ordinal: -1 },
      '\\p{Enclosing_Mark}': { label: 'Enclosing Mark', ordinal: -1 },
      '\\P{Me}': { label: 'non-Enclosing Mark', ordinal: -1 },
      '\\P{Enclosing_Mark}': { label: 'non-Enclosing Mark', ordinal: -1 },
      '\\p{Mn}': { label: 'Nonspacing Mark', ordinal: -1 },
      '\\p{Nonspacing_Mark}': { label: 'Nonspacing Mark', ordinal: -1 },
      '\\P{Mn}': { label: 'non-Nonspacing Mark', ordinal: -1 },
      '\\P{Nonspacing_Mark}': { label: 'non-Nonspacing Mark', ordinal: -1 },
      '\\p{N}': { label: 'Number', ordinal: -1 },
      '\\p{Number}': { label: 'Number', ordinal: -1 },
      '\\P{N}': { label: 'non-Number', ordinal: -1 },
      '\\P{Number}': { label: 'non-Number', ordinal: -1 },
      '\\p{Nd}': { label: 'Decimal Number', ordinal: -1 },
      '\\p{Decimal_Number}': { label: 'Decimal Number', ordinal: -1 },
      '\\P{Nd}': { label: 'non-Decimal Number', ordinal: -1 },
      '\\P{Decimal_Number}': { label: 'non-Decimal Number', ordinal: -1 },
      '\\p{Nl}': { label: 'Letter Number', ordinal: -1 },
      '\\p{Letter_Number}': { label: 'Letter Number', ordinal: -1 },
      '\\P{Nl}': { label: 'non-Letter Number', ordinal: -1 },
      '\\P{Letter_Number}': { label: 'non-Letter Number', ordinal: -1 },
      '\\p{No}': { label: 'Other Number', ordinal: -1 },
      '\\p{Other_Number}': { label: 'Other Number', ordinal: -1 },
      '\\P{No}': { label: 'non-Other Number', ordinal: -1 },
      '\\P{Other_Number}': { label: 'non-Other Number', ordinal: -1 },
      '\\p{P}': { label: 'Punctuation', ordinal: -1 },
      '\\p{Punctuation}': { label: 'Punctuation', ordinal: -1 },
      '\\P{P}': { label: 'non-Punctuation', ordinal: -1 },
      '\\P{Punctuation}': { label: 'non-Punctuation', ordinal: -1 },
      '\\p{Pc}': { label: 'Connector Punctuation', ordinal: -1 },
      '\\p{Connector_Punctuation}': {
        label: 'Connector Punctuation',
        ordinal: -1,
      },
      '\\P{Pc}': { label: 'non-Connector Punctuation', ordinal: -1 },
      '\\P{Connector_Punctuation}': {
        label: 'non-Connector Punctuation',
        ordinal: -1,
      },
      '\\p{Pd}': { label: 'Dash Punctuation', ordinal: -1 },
      '\\p{Dash_Punctuation}': { label: 'Dash Punctuation', ordinal: -1 },
      '\\P{Pd}': { label: 'non-Dash Punctuation', ordinal: -1 },
      '\\P{Dash_Punctuation}': { label: 'non-Dash Punctuation', ordinal: -1 },
      '\\p{Pe}': { label: 'Close Punctuation', ordinal: -1 },
      '\\p{Close_Punctuation}': { label: 'Close Punctuation', ordinal: -1 },
      '\\P{Pe}': { label: 'non-Close Punctuation', ordinal: -1 },
      '\\P{Close_Punctuation}': { label: 'non-Close Punctuation', ordinal: -1 },
      '\\p{Pf}': { label: 'Final Punctuation', ordinal: -1 },
      '\\p{Final_Punctuation}': { label: 'Final Punctuation', ordinal: -1 },
      '\\P{Pf}': { label: 'non-Final Punctuation', ordinal: -1 },
      '\\P{Final_Punctuation}': { label: 'non-Final Punctuation', ordinal: -1 },
      '\\p{Pi}': { label: 'Initial Punctuation', ordinal: -1 },
      '\\p{Initial_Punctuation}': { label: 'Initial Punctuation', ordinal: -1 },
      '\\P{Pi}': { label: 'non-Initial Punctuation', ordinal: -1 },
      '\\P{Initial_Punctuation}': {
        label: 'non-Initial Punctuation',
        ordinal: -1,
      },
      '\\p{Po}': { label: 'Other Punctuation', ordinal: -1 },
      '\\p{Other_Punctuation}': { label: 'Other Punctuation', ordinal: -1 },
      '\\P{Po}': { label: 'non-Other Punctuation', ordinal: -1 },
      '\\P{Other_Punctuation}': { label: 'non-Other Punctuation', ordinal: -1 },
      '\\p{Ps}': { label: 'Open Punctuation', ordinal: -1 },
      '\\p{Open_Punctuation}': { label: 'Open Punctuation', ordinal: -1 },
      '\\P{Ps}': { label: 'non-Open Punctuation', ordinal: -1 },
      '\\P{Open_Punctuation}': { label: 'non-Open Punctuation', ordinal: -1 },
      '\\p{S}': { label: 'Symbol', ordinal: -1 },
      '\\p{Symbol}': { label: 'Symbol', ordinal: -1 },
      '\\P{S}': { label: 'non-Symbol', ordinal: -1 },
      '\\P{Symbol}': { label: 'non-Symbol', ordinal: -1 },
      '\\p{Sc}': { label: 'Currency Symbol', ordinal: -1 },
      '\\p{Currency_Symbol}': { label: 'Currency Symbol', ordinal: -1 },
      '\\P{Sc}': { label: 'non-Currency Symbol', ordinal: -1 },
      '\\P{Currency_Symbol}': { label: 'non-Currency Symbol', ordinal: -1 },
      '\\p{Sk}': { label: 'Modifier Symbol', ordinal: -1 },
      '\\p{Modifier_Symbol}': { label: 'Modifier Symbol', ordinal: -1 },
      '\\P{Sk}': { label: 'non-Modifier Symbol', ordinal: -1 },
      '\\P{Modifier_Symbol}': { label: 'non-Modifier Symbol', ordinal: -1 },
      '\\p{Sm}': { label: 'Math Symbol', ordinal: -1 },
      '\\p{Math_Symbol}': { label: 'Math Symbol', ordinal: -1 },
      '\\P{Sm}': { label: 'non-Math Symbol', ordinal: -1 },
      '\\P{Math_Symbol}': { label: 'non-Math Symbol', ordinal: -1 },
      '\\p{So}': { label: 'Other Symbol', ordinal: -1 },
      '\\p{Other_Symbol}': { label: 'Other Symbol', ordinal: -1 },
      '\\P{So}': { label: 'non-Other Symbol', ordinal: -1 },
      '\\P{Other_Symbol}': { label: 'non-Other Symbol', ordinal: -1 },
      '\\p{Z}': { label: 'Separator', ordinal: -1 },
      '\\p{Separator}': { label: 'Separator', ordinal: -1 },
      '\\P{Z}': { label: 'non-Separator', ordinal: -1 },
      '\\P{Separator}': { label: 'non-Separator', ordinal: -1 },
      '\\p{Zl}': { label: 'Line Separator', ordinal: -1 },
      '\\p{Line_Separator}': { label: 'Line Separator', ordinal: -1 },
      '\\P{Zl}': { label: 'non-Line Separator', ordinal: -1 },
      '\\P{Line_Separator}': { label: 'non-Line Separator', ordinal: -1 },
      '\\p{Zp}': { label: 'Paragraph Separator', ordinal: -1 },
      '\\p{Paragraph_Separator}': { label: 'Paragraph Separator', ordinal: -1 },
      '\\P{Zp}': { label: 'non-Paragraph Separator', ordinal: -1 },
      '\\P{Paragraph_Separator}': {
        label: 'non-Paragraph Separator',
        ordinal: -1,
      },
      '\\p{Zs}': { label: 'Space Separator', ordinal: -1 },
      '\\p{Space_Separator}': { label: 'Space Separator', ordinal: -1 },
      '\\P{Zs}': { label: 'non-Space Separator', ordinal: -1 },
      '\\P{Space_Separator}': { label: 'non-Space Separator', ordinal: -1 },
      '\\k<title>': { label: 'Back reference (group = title)', ordinal: -1 },
    },
    (content, str) => {
      it(`parses "${str}" as an Escape`, function () {
        var parser = new javascript.Parser(str);

        expect(parser.__consume__terminal()).toEqual(
          jasmine.objectContaining(content)
        );
      });
    }
  );

  describe('#_render', function () {
    beforeEach(function () {
      var parser = new javascript.Parser('\\b');
      this.node = parser.__consume__terminal();
      this.node.state = {};

      this.svg = Snap(document.createElement('svg'));
      this.node.container = this.svg.group();
      spyOn(this.node, 'renderLabel').and.callThrough();
    });

    it('renders a label', function () {
      this.node._render();

      expect(this.node.renderLabel).toHaveBeenCalledWith('word boundary');
    });

    it('sets the edge radius of the rect', function (done) {
      this.node
        ._render()
        .then((label) => {
          expect(label.select('rect').attr()).toEqual(
            jasmine.objectContaining({
              rx: '3',
              ry: '3',
            })
          );
          done();
        })
        .catch(done.fail);
    });
  });
});
