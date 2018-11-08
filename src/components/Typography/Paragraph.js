/* @flow */

import * as React from 'react';
import { Text, StyleSheet } from 'react-native';
import StyledText from './StyledText';

type Props = React.ElementConfig<typeof Text> & {
  style?: any,
};

/**
 * Typography component for showing a paragraph.
 *
 * <div class="screenshots">
 *   <img src="screenshots/paragraph.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Paragraph } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Paragraph>Paragraph</Paragraph>
 * );
 *
 * export default MyComponent;
 * ```
 */
const Paragraph = (props: Props) => (
  <StyledText
    {...props}
    alpha={0.87}
    family="regular"
    style={[styles.text, props.style]}
  />
);

export default Paragraph;

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    lineHeight: 20,
    marginVertical: 2,
  },
});
