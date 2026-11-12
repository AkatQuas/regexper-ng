// Reserved double punctuators cannot appear unescaped in a Unicode Sets class.
// `&&` and `--` are operators, handled by the intersection and subtraction rules.
const RESERVED_DOUBLE_PUNCTUATOR = /&&|!!|##|\$\$|%%|\*\*|\+\+|,,|\.\.|::|;;|<<|==|>>|\?\?|@@|\^\^|``|~~/;

export function collectOperands(properties) {
  const rest = properties.rest && properties.rest.elements
    ? properties.rest.elements
    : [];

  return [properties.head].concat(
    rest.map((element) => element.properties.operand)
  );
}

export function assertSetOperands(node) {
  if (node.operands.some((operand) => operand.type === 'charset-range')) {
    throw `Invalid set operation in character class: ${node.textValue}`;
  }
}

export function assertNoReservedDoubles(operands) {
  for (let index = 0; index < operands.length - 1; index += 1) {
    const pair = literalChar(operands[index]) + literalChar(operands[index + 1]);

    if (RESERVED_DOUBLE_PUNCTUATOR.test(pair)) {
      throw `Invalid set operation in character class: ${pair}`;
    }
  }
}

export function assertNoReservedDoublesInText(text) {
  if (RESERVED_DOUBLE_PUNCTUATOR.test(text)) {
    throw `Invalid set operation in character class: ${text}`;
  }
}

function literalChar(operand) {
  if (operand && operand.type === 'literal' && operand.literal && operand.literal.length === 1) {
    return operand.literal;
  }

  return '';
}
