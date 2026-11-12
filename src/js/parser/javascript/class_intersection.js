import _ from 'lodash';
import util from '../../util.js';
import { assertSetOperands, collectOperands } from './set_operands.js';

export default {
  type: 'class-intersection',

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
    this.label = 'Intersection:';
    this.operands = collectOperands(this.properties);
    assertSetOperands(this);
  },
};
