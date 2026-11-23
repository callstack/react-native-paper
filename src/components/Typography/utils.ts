import { Platform, StyleSheet } from 'react-native';

import type { Direction } from '../../core/locale';

// A `left` alignment follows the layout direction on Android and iOS, but
// stays physical on web, so right-to-left text aligns right there.
export const getTextAlignStyle = (direction: Direction) =>
  Platform.OS === 'web' && direction === 'rtl' ? styles.rtlWeb : styles.start;

const styles = StyleSheet.create({
  start: { textAlign: 'left' },
  rtlWeb: { textAlign: 'right' },
});
