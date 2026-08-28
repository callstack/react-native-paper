import { useWindowDimensions } from 'react-native';

/**
 * How many lines a title or cell may use.
 *
 * An explicit value is always honoured. Otherwise text is clamped to one line
 * at ordinary font scales, and allowed to wrap once the OS font scale
 * gets large enough that clamping would throw content away.
 */
export default function useReflowedNumberOfLines(numberOfLines?: number) {
  const { fontScale } = useWindowDimensions();

  if (numberOfLines != null) {
    return numberOfLines || undefined;
  }

  return fontScale > 1 ? undefined : 1;
}
