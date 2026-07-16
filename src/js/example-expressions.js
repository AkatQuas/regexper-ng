const EXAMPLE_EXPRESSIONS = [
  'Lions(?: and|,) tigers,? and bears\\. Oh my!',
  '(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})',
  '\\w\\x7f\\u00bb\\1\\0\\k<name>\\p{P}\\P{Sc}',
  '(example\\s)(?=content)(?<name>Bob)',
  '/[\\w&&\\d--_]/v',
  '(?ims:foo. bar)|(?-i:[A-Z]+)',
  '(?:greedy)*|(?:non-greedy)*?',
  'one\\s|two\\W|three\\t|four\\n',
  '[#a-z\\n][^$0-9\\b]',
  '(?<quote>["\'])(?:(?!\\k<quote>).)*\\k<quote>',
  '(?<=\\$)\\{[^{}]+\\}|(?<!\\/\\/).+',
  '/[\\q{foo|bar}&&[a-z]]/v',
];

export function randomExample(exclude = '') {
  const candidates = exclude
    ? EXAMPLE_EXPRESSIONS.filter((expression) => expression !== exclude)
    : EXAMPLE_EXPRESSIONS;

  return candidates[Math.floor(Math.random() * candidates.length)];
}

export default EXAMPLE_EXPRESSIONS;
