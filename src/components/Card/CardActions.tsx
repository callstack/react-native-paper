import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';

export type Props = ViewProps & {
  /**
   * Items inside the `CardActions`.
   */
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  theme?: ThemeProp;
};

/**
 * A component to show a list of actions inside a Card.
 * Actions are rendered directly, so set button `mode`, `compact`, and custom
 * spacing props explicitly on each action when needed.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Card, Button } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Card>
 *     <Card.Actions>
 *       <Button mode="outlined">Cancel</Button>
 *       <Button mode="contained">Ok</Button>
 *     </Card.Actions>
 *   </Card>
 * );
 *
 * export default MyComponent;
 * ```
 */
const CardActions = ({ theme, style, children, ...rest }: Props) => {
  useInternalTheme(theme);

  const containerStyle = [
    styles.container,
    { justifyContent: 'flex-end' } satisfies ViewStyle,
    style,
  ];
  const items = React.Children.toArray(children);

  return (
    <View {...rest} style={containerStyle}>
      {items.map((child, index) => (
        <React.Fragment
          key={
            React.isValidElement(child) && child.key != null ? child.key : index
          }
        >
          {index > 0 && <View style={styles.spacer} />}
          {child}
        </React.Fragment>
      ))}
    </View>
  );
};

CardActions.displayName = 'Card.Actions';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  spacer: {
    width: 8,
  },
});

export default CardActions;
