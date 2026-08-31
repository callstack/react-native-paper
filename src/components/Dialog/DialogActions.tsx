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
 * 						<Button key="disagree-btn" onPress={close} textColor={Palette.error50}>
 * 							Disagree
 * 						</Button>,
 * 						<Button key="agree-btn" onPress={close}>
 * 							Agree
 *  					</Button>,
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
