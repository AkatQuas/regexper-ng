import _ from 'lodash';
import util from '../../util.js';

export default {
  type: 'class-union',

  definedProperties: {
    _anchor: {
      get() {
        const matrix = this.transform().localMatrix;

        return {
          ay: matrix.y(0, this.partContainer.getBBox().cy),
        };
      },
    },
  },

  _render() {
    this.partContainer = this.container.group();

    return Promise.all(
      _.map(this.operands, (operand) => operand.render(this.partContainer.group()))
    ).then(() => {
      util.spaceVertically(this.operands, { padding: 5 });

      return this.renderLabeledBox(this.label, this.partContainer, {
        padding: 5,
      });
    });
  },

  setup() {
    this.label = 'One of:';
    const tailOperands = this.properties.tail
      ? this.properties.tail.elements
      : [];

    this.operands = [this.properties.head].concat(tailOperands);
  },
};
