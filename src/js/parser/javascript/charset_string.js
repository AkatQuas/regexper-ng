import { assertNoReservedDoublesInText } from './set_operands.js';

export default {
  type: 'charset-string',

  _render() {
    return this.renderLabel(this.label).then((label) => {
      label.select('rect').attr({
        rx: 3,
        ry: 3,
      });
      return label;
    });
  },

  setup() {
    const items = this.properties.items.elements.map((item) => item.textValue);

    items.forEach(assertNoReservedDoublesInText);

    this.label = items.length > 1
      ? `strings: ${items.join(' | ')}`
      : `string: ${items[0]}`;
  },
};
