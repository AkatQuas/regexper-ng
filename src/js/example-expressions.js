const EXAMPLE_EXPRESSIONS = [
  '(?<year>\\d{4})-(?<month>0[1-9]|1[0-2])-(?<day>0[1-9]|[12]\\d|3[01])',
  '(?<major>0|[1-9]\\d*)\\.(?<minor>0|[1-9]\\d*)\\.(?<patch>0|[1-9]\\d*)(?:-(?<pre>[0-9A-Za-z.-]+))?',
  '(?<quote>["\'])(?:(?!\\k<quote>).)*\\k<quote>',
  '/(?<word>\\p{L}+)(?<punct>\\p{P})/u',
  '/(?<城市>\\p{Script=Han}+)/u',
  '/\\u{1F600}|\\u{1F44B}/u',
  '/begin.+end/s',
  '/^\\s*#+\\s+.+$/m',
  '(?i:[a-z]{3,})(?-i:\\d{2,4})',
  '(?s:.*START.*END)|(?-s:\\S+)',
  '(?<=\\$)\\d+(?:\\.\\d{2})?(?!%)',
  '(?<!\\/\\/)[^\\n]+',
  '/[\\p{L}&&\\p{ASCII}]/v',
  '/[[a-z]--[aeiou]--[y]]/v',
  '/[[\\q{http|https}]&&[a-z]]/v',
  '(?:https?:\\/\\/)?(?:[\\w-]+\\.)+[a-z]{2,6}',
  '/#[0-9a-fA-F]{3,8}\\b/i',
  '<[^>]+>.*?<\\/[^>]+>',
];

export function randomExample(exclude = '') {
  const candidates = exclude
    ? EXAMPLE_EXPRESSIONS.filter((expression) => expression !== exclude)
    : EXAMPLE_EXPRESSIONS;

  return candidates[Math.floor(Math.random() * candidates.length)];
}

export default EXAMPLE_EXPRESSIONS;
