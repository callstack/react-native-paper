/* @flow */

import * as React from 'react';
import { Text, StyleSheet, StyleProp } from 'react-native';
import { TextStyle } from 'react-native/Libraries/StyleSheet/StyleSheet';

import StyledText from './StyledText';

type Props = React.ComponentProps<typeof Text> & {
  style?: StyleProp<TextStyle>,
};

/**
 * Typography component for showing a subheading.
 *
 * <div class="screenshots">
 *   <img src="screenshots/subheading.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Subheading } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Subheading>Subheading</Subheading>
 * );
 *
 * export default MyComponent;
 * ```
 */
const Subheading = (props: Props) => (
  <StyledText
    {...props}
    alpha={0.87}
    family="regular"
    style={[styles.text, props.style]}
  />
);

export default Subheading;

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 24,
    marginVertical: 2,
  },
});
