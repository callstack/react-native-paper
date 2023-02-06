import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import type { ThemeProp } from 'src/types';

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
 * <div class="screenshots">
 *   <figure>
 *     <img class="small" src="screenshots/card-actions.png" />
 *   </figure>
 * </div>
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
const CardActions = (props: Props) => {
  const { isV3 } = useInternalTheme(props.theme);
  const justifyContent = isV3 ? 'flex-end' : 'flex-start';

  return (
    <View
      {...props}
      style={[styles.container, props.style, { justifyContent }]}
    >
      {React.Children.map(props.children, (child, i) => {
        return React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<any>, {
              compact: !isV3 && child.props.compact !== false,
              mode:
                child.props.mode ||
                (isV3 && (i === 0 ? 'outlined' : 'contained')),
              style: [isV3 && styles.button, child.props.style],
            })
          : child;
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
