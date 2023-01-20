import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import type { ThemeProp } from 'src/types';

import { useInternalTheme } from '../../core/theming';

export type Props = React.ComponentPropsWithRef<typeof View> & {
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
 * <div class="screenshots">
 *   <figure>
 *     <img class="small" src="screenshots/dialog-actions.png" />
 *   </figure>
 * </div>
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
const DialogActions = (props: Props) => {
  const { isV3 } = useInternalTheme(props.theme);
  const actionsLength = React.Children.toArray(props.children).length;

  return (
    <View
      {...props}
      style={[isV3 ? styles.v3Container : styles.container, props.style]}
    >
      {React.Children.map(props.children, (child, i) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<any>, {
              compact: true,
              uppercase: !isV3,
              style: isV3 && {
                paddingRight: i + 1 === actionsLength ? 0 : 8,
              },
            })
          : child
      )}
    </View>
  );
};

DialogActions.displayName = 'Dialog.Actions';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 8,
  },
  v3Container: {
    flexDirection: 'row',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
});

export default DialogActions;
