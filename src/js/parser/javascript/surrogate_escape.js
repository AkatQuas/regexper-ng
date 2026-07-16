// Surrogate pair escape sequences (\uD800\uDC00) used in Unicode mode.

export default {
  type: 'surrogate-escape',

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
    const lead = parseInt(this.properties.lead.textValue, 16);
    const trail = parseInt(this.properties.trail.textValue, 16);
    const codePoint = 0x10000 + ((lead - 0xd800) << 10) + (trail - 0xdc00);

    this.label = `U+${codePoint.toString(16).toUpperCase()}`;
  },
};
