import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

import { CardContext } from './CardContext';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../theme/types';

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
  const cardContext = React.useContext(CardContext);

  const cardMarginStyle = cardContext
    ? cardContext.direction === 'horizontal'
      ? {
          marginTop: -cardContext.padding,
          marginRight: -cardContext.padding,
          marginBottom: -cardContext.padding,
        }
      : {
          marginLeft: -cardContext.padding,
          marginRight: -cardContext.padding,
          marginBottom: -cardContext.padding,
        }
    : null;

  const containerStyle = [
    styles.container,
    cardMarginStyle,
    { justifyContent: 'flex-end' } satisfies ViewStyle,
    style,
  ];

  return (
    <View {...rest} style={containerStyle}>
      {children}
    </View>
  );
};

CardActions.displayName = 'Card.Actions';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
});

export default CardActions;
