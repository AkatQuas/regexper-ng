export default {
  type: 'nested-charset',

  definedProperties: {
    _anchor: {
      get() {
        const matrix = this.transform().localMatrix;

        return {
          ay: matrix.y(0, this.body.getBBox().cy),
        };
      },
    },
  },

  _render() {
    return this.body.render(this.container.group());
  },

  setup() {
    this.body = this.properties.body;
  },
};
