import _ from 'lodash';
import Snap from 'snapsvg';
import Node from '../../../src/js/parser/javascript/node.js';
import javascript from '../../../src/js/parser/javascript/parser.js';
import Parser from '../../../src/js/parser/javascript.js';

describe('parser/javascript/subexp.js', function () {
  beforeEach(function () {
    Node.state = { groupCounter: 1 };
  });

  _.forIn(
    {
      '(test)': {
        regexp: jasmine.objectContaining({ textValue: 'test' }),
      },
      '(?=test)': {
        regexp: jasmine.objectContaining({ textValue: 'test' }),
      },
      '(?!test)': {
        regexp: jasmine.objectContaining({ textValue: 'test' }),
      },
      '(?:test)': {
        regexp: jasmine.objectContaining({ textValue: 'test' }),
        // UPDATED AT "2021/11/04 22:02", we like the label "non-capturing"
        // so remove the proxy
        // proxy: jasmine.objectContaining({ textValue: 'test' }),
      },
      '(?<=test)': {
        regexp: jasmine.objectContaining({ textValue: 'test' }),
      },
      '(?<!test)': {
        regexp: jasmine.objectContaining({ textValue: 'test' }),
      },
      '(?<name>test)': {
        regexp: jasmine.objectContaining({ textValue: 'test' }),
      },
    },
    (content, str) => {
      it(`parses "${str}" as a Subexp`, function () {
        var parser = new javascript.Parser(str);

        expect(parser.__consume__subexp()).toEqual(
          jasmine.objectContaining(content)
        );
      });
    }
  );

  describe('_anchor property', function () {
    it('applies the local transform matrix to the anchor from the regexp', function () {
      var node = new javascript.Parser('(test)').__consume__subexp();

      node.regexp = {
        getBBox() {
          return {
            ax: 10,
            ax2: 15,
            ay: 20,
          };
        },
      };

      spyOn(node, 'transform').and.returnValue({
        localMatrix: Snap.matrix().translate(3, 8),
      });

      expect(node._anchor).toEqual({
        ax: 13,
        ax2: 18,
        ay: 28,
      });
    });
  });

  describe('#_render', function () {
    beforeEach(function () {
      this.renderDeferred = this.testablePromise();

      this.node = new javascript.Parser('(test)').__consume__subexp();
      this.node.regexp = jasmine.createSpyObj('regexp', ['render']);
      this.node.container = jasmine.createSpyObj('container', [
        'addClass',
        'group',
      ]);
      spyOn(this.node, 'label').and.returnValue('example label');

      this.node.regexp.render.and.returnValue(this.renderDeferred.promise);
    });

    it('renders the regexp', function () {
      this.node._render();

      expect(this.node.regexp.render).toHaveBeenCalled();
    });

    it('renders a labeled box', function (done) {
      spyOn(this.node, 'renderLabeledBox');
      this.renderDeferred.resolve();
      this.node
        ._render()
        .then(() => {
          expect(this.node.renderLabeledBox).toHaveBeenCalledWith(
            'example label',
            this.node.regexp,
            { padding: 10 }
          );
          done();
        })
        .catch(done.fail);
    });
  });

  describe('#label', function () {
    _.forIn(
      {
        '(test)': {
          label: 'group #1',
          groupCounter: 2,
        },
        '(?=test)': {
          label: 'positive lookahead',
          groupCounter: 1,
        },
        '(?!test)': {
          label: 'negative lookahead',
          groupCounter: 1,
        },
        '(?:test)': {
          label: 'non-capturing',
          groupCounter: 1,
        },
        '(?<=test)': {
          label: 'positive lookbehind',
          groupCounter: 1,
        },
        '(?<!test)': {
          label: 'negative lookbehind',
          groupCounter: 1,
        },
        '(?<name>test)': {
          label: 'group #1 name',
          groupCounter: 2,
        },
        '(?<名字>test)': {
          label: 'group #1 名字',
          groupCounter: 2,
        },
        '(?<$a>test)': {
          label: 'group #1 $a',
          groupCounter: 2,
        },
        '(?<_a>test)': {
          label: 'group #1 _a',
          groupCounter: 2,
        },
        '(?i:test)': {
          label: 'modifiers (+ignore case)',
          groupCounter: 1,
        },
        '(?-i:test)': {
          label: 'modifiers (-ignore case)',
          groupCounter: 1,
        },
        '(?i-s:test)': {
          label: 'modifiers (+ignore case; -dot all)',
          groupCounter: 1,
        },
      },
      (data, str) => {
        it(`generates the correct label for "${str}"`, function () {
          var node = new javascript.Parser(str).__consume__subexp();

          expect(node.label()).toEqual(data.label);
          expect(node.state.groupCounter).toEqual(data.groupCounter);
        });
      }
    );
  });

  describe('group names', function () {
    it('rejects names that are not identifiers', function () {
      expect(() => {
        new javascript.Parser('(?<1abc>a)').__consume__subexp();
      }).toThrow('Invalid capture group name: 1abc');
    });
  });

  describe('inline modifiers', function () {
    function renderText(expression) {
      const container = document.createElement('div');
      document.body.appendChild(container);
      const parser = new Parser(container);

      return parser
        .parse(expression)
        .then((instance) => instance.render())
        .then(() => container.textContent)
        .finally(() => container.remove());
    }

    it('lets an inline s flag include line breaks', function (done) {
      renderText('(?s:.)')
        .then((text) => {
          expect(text).toContain('any character');
          expect(text).not.toContain('except line breaks');
          done();
        })
        .catch(done.fail);
    });

    it('lets an inline m flag describe line anchors', function (done) {
      renderText('(?m:^)')
        .then((text) => {
          expect(text).toContain('Start of line');
          done();
        })
        .catch(done.fail);
    });

    it('turns dot-all off inside a disabling group', function (done) {
      renderText('/(?-s:.)/s')
        .then((text) => {
          expect(text).toContain('any character except line breaks');
          done();
        })
        .catch(done.fail);
    });
  });

  describe('lookbehind with slash literals', function () {
    it('requires escaped slashes inside lookbehind', function () {
      expect(() => javascript.parse('(?<!\\/\\/)')).not.toThrow();
    });

    it('rejects unescaped slashes inside lookbehind', function () {
      expect(() => javascript.parse('(?<!//)')).toThrow();
    });
  });
});
