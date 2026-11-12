export default {
  _render() {
    return this.renderLabel(this.matchLabel()).then(label => label.addClass('anchor'));
  },

  matchLabel() {
    const multiline = Boolean(this.state && this.state.multiline);

    if (this.textValue === '^') {
      return multiline ? 'Start of line' : 'Start of text';
    }

    return multiline ? 'End of line' : 'End of text';
  },

  setup() {
    this.label = this.matchLabel();
  },
};
