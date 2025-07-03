import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import type { ThemeProp } from 'src/types';

import { CardActionChildProps } from './utils';
import { useInternalTheme } from '../../core/theming';

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
const CardActions = ({ theme, style, children, ...rest }: Props) => {
  const { isV3 } = useInternalTheme(theme);

  const justifyContent = (
    isV3 ? 'flex-end' : 'flex-start'
  ) as ViewStyle['justifyContent'];
  const containerStyle = [styles.container, { justifyContent }, style];

  return (
    <View {...rest} style={containerStyle}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement<CardActionChildProps>(child)) {
          return child;
        }

        const compact = !isV3 && child.props.compact !== false;
        const mode =
          child.props.mode ??
          (isV3 ? (index === 0 ? 'outlined' : 'contained') : undefined);
        const childStyle = [isV3 && styles.button, child.props.style];

        return React.cloneElement(child, {
          ...child.props,
          compact,
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
