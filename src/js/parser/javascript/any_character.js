// AnyCharacter nodes are for `*` regular expression syntax. They are rendered
// as just an "any character" label.

export default {
  type: 'any-character',

  _render() {
    const label = this.state && this.state.dotAll
      ? 'any character'
      : 'any character except line breaks';

    return this.renderLabel(label);
  },
};
