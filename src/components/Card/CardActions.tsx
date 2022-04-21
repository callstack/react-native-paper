import * as React from 'react';
import { StyleSheet, StyleProp, View, ViewStyle } from 'react-native';
import type { Theme } from '../../types';

type Props = React.ComponentPropsWithRef<typeof View> & {
  /**
   * Items inside the `CardActions`.
   */
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  theme?: Theme;
};

/**
 * A component to show a list of actions inside a Card.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="medium" src="screenshots/card-actions.png" />
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
  const justifyContent = props?.theme?.isV3 ? 'flex-end' : 'flex-start';

  return (
    <View
      {...props}
      style={[styles.container, props.style, { justifyContent }]}
    >
      {React.Children.map(props.children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, {
              compact: child.props.compact !== false,
            })
          : child
      )}
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
});

export default CardActions;
