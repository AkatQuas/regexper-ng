// Split a regex literal into pattern and flags, mirroring ECMAScript's two-step
// parsing so Unicode Sets (/v) and Unicode (/u) modes can be applied to the
// pattern before it is parsed.

const FLAG_PATTERN = /^[yigmusdv]*$/;
const SLASH_LITERAL = /^\/((?:\\.|[^/\\])+)\/([yigmusdv]*)$/;

export function splitRegexLiteral(expression) {
  const slashMatch = expression.match(SLASH_LITERAL);

  if (slashMatch) {
    const flags = slashMatch[2];

    if (!FLAG_PATTERN.test(flags)) {
      throw new Error(`Invalid flags: ${flags}`);
    }

    return {
      pattern: slashMatch[1],
      flags,
      slashDelimited: true,
    };
  }

  return {
    pattern: expression,
    flags: '',
    slashDelimited: false,
  };
}

export function regexModes(flags) {
  const unicodeSetsMode = flags.includes('v');
  const unicodeMode = flags.includes('u') || unicodeSetsMode;

  return { unicodeMode, unicodeSetsMode };
}
