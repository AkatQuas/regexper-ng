// Split a regex literal into pattern and flags, mirroring ECMAScript's two-step
// parsing so Unicode Sets (/v) and Unicode (/u) modes can be applied to the
// pattern before it is parsed.

const SLASH_LITERAL = /^\/((?:\\.|[^/\\])+)\/([a-zA-Z]*)$/;

function validateFlags(flags) {
  if (!/^[yigmusdv]*$/.test(flags)) {
    throw new Error(`Invalid flags: ${flags}`);
  }

  const seen = new Set();

  for (const flag of flags) {
    if (seen.has(flag)) {
      throw new Error(`Duplicate flag: ${flag}`);
    }
    seen.add(flag);
  }

  if (flags.includes('u') && flags.includes('v')) {
    throw new Error('Invalid flags: u and v cannot be combined');
  }
}

export function splitRegexLiteral(expression) {
  const slashMatch = expression.match(SLASH_LITERAL);

  if (slashMatch) {
    const flags = slashMatch[2];

    validateFlags(flags);

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

  return {
    unicodeMode,
    unicodeSetsMode,
    dotAll: flags.includes('s'),
    multiline: flags.includes('m'),
  };
}
