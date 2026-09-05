import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../theme/types';

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
 * Actions are rendered directly, so configure each action button's props
 * explicitly when you need non-default behavior.
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
 *       <Dialog visible={visible} onDismiss={hideDialog}>
 *         <Dialog.Actions>
 *           <Button onPress={() => console.log('Cancel')}>Cancel</Button>
 *           <Button onPress={() => console.log('Ok')}>Ok</Button>
 *         </Dialog.Actions>
 *       </Dialog>
 *     </Portal>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
const DialogActions = ({
  theme: themeOverrides,
  style,
  children,
  ...rest
}: Props) => {
  useInternalTheme(themeOverrides);

  const items = React.Children.toArray(children);

  return (
    <View {...rest} style={[styles.v3Container, style]}>
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
  spacer: {
    width: 8,
  },
});

export default DialogActions;
