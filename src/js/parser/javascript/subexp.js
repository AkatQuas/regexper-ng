// Subexp nodes are for expressions inside of parenthesis. It is rendered as a
// labeled box around the contained expression if a label is required.

import _ from 'lodash';
import { assertGroupName } from './group_name.js';

export default {
  type: 'subexp',

  definedProperties: {
    // Default anchor is overridden to move it down to account for the group
    // label and outline box.
    _anchor: {
      get: function () {
        var anchor = this.regexp.getBBox(),
          matrix = this.transform().localMatrix;

        return {
          ax: matrix.x(anchor.ax, anchor.ay),
          ax2: matrix.x(anchor.ax2, anchor.ay),
          ay: matrix.y(anchor.ax, anchor.ay),
        };
      },
    },
  },

  labelMap: {
    '?:': 'non-capturing',
    '?=': 'positive lookahead',
    '?!': 'negative lookahead',
    '?<=': 'positive lookbehind',
    '?<!': 'negative lookbehind',
  },

  modifierFlagLabels: {
    i: 'ignore case',
    m: 'multiline',
    s: 'dot all',
  },

  // Renders the subexp into the currently set container.
  _render() {
    // **NOTE:** `this.label()` **MUST** be called here, in _render, and before
    // any child nodes are rendered. This is to keep the group numbers in the
    // correct order.
    let label = this.label();
    const previousModes = this.pushModifiers();

    // Render the contained regexp.
    return (
      this.regexp
        .render(this.container.group())
        // Create the labeled box around the regexp.
        .then(() =>
          this.renderLabeledBox(label, this.regexp, {
            padding: 10,
          })
        )
        .then(
          (result) => {
            this.popModifiers(previousModes);
            return result;
          },
          (error) => {
            this.popModifiers(previousModes);
            throw error;
          }
        )
    );
  },

  // Returns the label for the subexpression.
  label() {
    const capture = this.properties.capture;

    if (!capture) {
      return `group #${this.state.groupCounter++}`;
    }

    if (_.has(this.labelMap, capture.textValue)) {
      return this.labelMap[capture.textValue];
    }

    if (
      capture.properties &&
      capture.properties.name
    ) {
      return `group #${this.state.groupCounter++} ${capture.properties.name.textValue}`;
    }

    if (
      capture.properties &&
      (capture.properties.enable || capture.properties.disable)
    ) {
      return this.modifierLabel(capture);
    }

    return `group #${this.state.groupCounter++}`;
  },

  modifierLabel(capture) {
    const parts = [];
    const enable = capture.properties.enable
      ? capture.properties.enable.textValue
      : '';
    const disable = capture.properties.disable
      ? capture.properties.disable.textValue
      : '';

    if (enable) {
      parts.push(`+${[...enable].map((flag) => this.modifierFlagLabels[flag]).join(', ')}`);
    }

    if (disable) {
      parts.push(`-${[...disable].map((flag) => this.modifierFlagLabels[flag]).join(', ')}`);
    }

    return `modifiers (${parts.join('; ')})`;
  },

  pushModifiers() {
    const previous = {
      dotAll: this.state && this.state.dotAll,
      multiline: this.state && this.state.multiline,
    };
    const capture = this.properties.capture;

    if (!this.state || !capture || !capture.properties) {
      return previous;
    }

    const enable = capture.properties.enable
      ? capture.properties.enable.textValue
      : '';
    const disable = capture.properties.disable
      ? capture.properties.disable.textValue
      : '';

    if (enable.includes('s')) {
      this.state.dotAll = true;
    }
    if (disable.includes('s')) {
      this.state.dotAll = false;
    }
    if (enable.includes('m')) {
      this.state.multiline = true;
    }
    if (disable.includes('m')) {
      this.state.multiline = false;
    }

    return previous;
  },

  popModifiers(previous) {
    if (!this.state || !previous) {
      return;
    }

    this.state.dotAll = previous.dotAll;
    this.state.multiline = previous.multiline;
  },

  setup() {
    // **NOTE:** **DO NOT** call `this.label()` in setup. It will lead to
    // groups being numbered in reverse order.
    this.regexp = this.properties.regexp;

    const capture = this.properties.capture;
    if (capture && capture.properties && capture.properties.name) {
      assertGroupName(capture.properties.name.textValue);
    }

    // If there is no need for a label, then proxy to the nested regexp.
    // UPDATED AT "2021/11/04 22:02", we like the label "non-capturing"
    // if (this.properties.capture.textValue == '?:') {
    //   this.proxy = this.regexp;
    // }
  },
};
