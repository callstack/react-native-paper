import * as React from 'react';
import { Text, TextStyle, StyleSheet, StyleProp } from 'react-native';

import StyledText from './StyledText';

export type Props = React.ComponentProps<typeof Text> & {
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
};

// @component-group Typography

/**
 * @deprecated Deprecated in v5.x - use `<Text variant="headlineSmall" />` instead.
 * Typography component for showing a headline.
 *
 * <div class="screenshots">
 *   <img src="screenshots/headline.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Headline } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Headline>Headline</Headline>
 * );
 *
 * export default MyComponent;
 * ```
 */
const Headline = (props: Props) => {
  return (
    <StyledText
      {...props}
      alpha={0.87}
      family="regular"
      style={[styles.text, props.style]}
    />
  );
};

export default Headline;

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
    lineHeight: 32,
    marginVertical: 2,
    letterSpacing: 0,
  },
});
