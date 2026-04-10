import * as React from 'react';
import { StyleProp, StyleSheet, TextStyle } from 'react-native';

import type { ThemeProp } from 'src/types';

import { useInternalTheme } from '../../core/theming';
import Text from '../Typography/Text';

export type Props = React.ComponentProps<typeof Text> & {
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * Style that is passed to Text element.
   */
  style?: StyleProp<TextStyle>;
  /**
   * Specifies the largest possible scale a text font can reach.
   */
  maxFontSizeMultiplier?: number;
};

/**
 * A component used to display a header in lists.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { List } from 'react-native-paper';
 *
 * const MyComponent = () => <List.Subheader>My List Title</List.Subheader>;
 *
 * export default MyComponent;
 * ```
 */
const ListSubheader = ({
  style,
  theme: overrideTheme,
  maxFontSizeMultiplier,
  ...rest
}: Props) => {
  const theme = useInternalTheme(overrideTheme);

  const textColor = theme.colors.onSurfaceVariant;

  const font = theme.fonts.bodyMedium;

  return (
    <Text
      variant="bodyMedium"
      numberOfLines={1}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      {...rest}
      style={[
        styles.container,
        {
          color: textColor,
          ...font,
        },
        style,
      ]}
    />
  );
};

ListSubheader.displayName = 'List.Subheader';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
});

export default ListSubheader;
