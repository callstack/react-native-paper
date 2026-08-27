import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';

export type Props = ViewProps & {
  /**
   * Content of the `DialogActions`.
   */
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme?: ThemeProp;
};

/**
 * A component to show a list of actions in a Dialog.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Button, Dialog, Portal } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [visible, setVisible] = React.useState(false);
 *
 *   const hideDialog = () => setVisible(false);
 *
 *   return (
 *     <Portal>
 *       <Dialog
 * 					visible={visible}
 * 					onDismiss={hideDialog}
 * 					actions={[
 * 						{ onPress: () => console.log('Cancel'), label: 'Cancel' },
 * 						{ onPress: () => console.log('Ok'), label: 'Ok' },
 * 					]}
 * 		   />
 *     </Portal>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
const DialogActions = ({ children, style, theme, ...rest }: Props) => {
  useInternalTheme(theme);

  const actions = React.Children.toArray(children).filter((child) =>
    React.isValidElement<{ style?: StyleProp<ViewStyle> }>(child)
  );

  return (
    <View {...rest} style={[styles.v3Container, style]}>
      {actions.map((child, index) => (
        <View
          key={child.key ?? index}
          style={[
            index === actions.length - 1 ? styles.itemLast : styles.item,
            child.props.style,
          ]}
        >
          {child}
        </View>
      ))}
    </View>
  );
};

DialogActions.displayName = 'Dialog.Actions';

const styles = StyleSheet.create({
  v3Container: {
    flexDirection: 'row',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  item: {
    marginRight: 8,
  },
  itemLast: {
    marginRight: 0,
  },
});

export default DialogActions;
