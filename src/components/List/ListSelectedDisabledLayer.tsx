import { StyleSheet, View } from 'react-native';

import { ListTokens } from './tokens';
import type { InternalTheme } from '../../theme/types';

/**
 * The MD3 container of a selected, disabled row: `onSurface` at 38% opacity.
 * It is a separate layer, so the opacity does not also fade the row content.
 */
const ListSelectedDisabledLayer = ({ theme }: { theme: InternalTheme }) => (
  <View
    style={[
      styles.layer,
      {
        backgroundColor:
          theme.colors[ListTokens.selectedDisabledContainerColor],
        opacity: ListTokens.selectedDisabledContainerOpacity,
      },
    ]}
  />
);

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFill,
    pointerEvents: 'none',
  },
});

export default ListSelectedDisabledLayer;
