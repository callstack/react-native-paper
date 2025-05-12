import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import type { ThemeProp } from 'src/types';

import { CardActionChildProps } from './utils';

export type Props = React.ComponentPropsWithRef<typeof View> & {
  /**
   * Items inside the `CardActions`.
   */
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  theme?: ThemeProp;
};

/**
 * A component to show a list of actions inside a Card.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Card, Button } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Card>
 *     <Card.Actions>
 *       <Button>Cancel</Button>
 *       <Button>Ok</Button>
 *     </Card.Actions>
 *   </Card>
 * );
 *
 * export default MyComponent;
 * ```
 */
const CardActions = ({ style, children, ...rest }: Props) => {
  const justifyContent = 'flex-end' as ViewStyle['justifyContent'];
  const containerStyle = [styles.container, { justifyContent }, style];

  return (
    <View {...rest} style={containerStyle}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement<CardActionChildProps>(child)) {
          return child;
        }

        const mode =
          child.props.mode ?? (index === 0 ? 'outlined' : 'contained');
        const childStyle = [styles.button, child.props.style];

        return React.cloneElement(child, {
          ...child.props,
          compact: false,
          mode,
          style: childStyle,
        });
      })}
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
  button: {
    marginLeft: 8,
  },
});

export default CardActions;
