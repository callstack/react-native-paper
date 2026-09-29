const GRAPHEME_PATTERN =
  '\\p{Regional_Indicator}{2}|' +
  '\\p{Extended_Pictographic}(?:\\p{Emoji_Modifier}|\\p{M})*(?:\\u200D\\p{Extended_Pictographic}(?:\\p{Emoji_Modifier}|\\p{M})*)*|' +
  '\\P{M}\\p{M}*|' +
  '.';

/**
 * Returns a regular expression that matches grapheme clusters.
 */
function getGraphemeRegExp(): RegExp | undefined {
  try {
    return new RegExp(GRAPHEME_PATTERN, 'gu');
  } catch {
    return undefined;
  }
}

const graphemeRegExp = getGraphemeRegExp();

/**
 * Returns the first `count` user-perceived characters (grapheme clusters).
 *
 * Handles combining marks, emoji (including ZWJ sequences and skin tones),
 * and flag emoji.
 */
export function takeGraphemes(value: string, count: number): string {
  if (count <= 0 || value === '') {
    return '';
  }

  const matches = graphemeRegExp
    ? value.match(graphemeRegExp)
    : Array.from(value);

  return (matches ?? []).slice(0, count).join('');
}
