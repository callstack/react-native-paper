import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { useInternalTheme } from '../../core/theming';
import Icon, { IconSource } from '../Icon';

export type Props = {
  /**
   *  Custom color for action icon.
   */
  color?: string;
  /**
   * Name of the icon to show.
   */
  icon: IconSource;
  /**
   * Optional icon size.
   */
  size?: number;
};

/**
 * @supported Available in v5.x with theme version 3
 * A component to show an icon in a Dialog.
 *
 *  <div class="screenshots">
 *   <img class="small" src="screenshots/dialog-icon.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { StyleSheet } from 'react-native';
 * import { Paragraph, Dialog, Portal } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [visible, setVisible] = React.useState(false);
 *
 *   const hideDialog = () => setVisible(false);
 *
 *   return (
 *     <Portal>
 *       <Dialog visible={visible} onDismiss={hideDialog}>
 *         <Dialog.Icon icon="alert" />
 *         <Dialog.Title style={styles.title}>This is a title</Dialog.Title>
 *         <Dialog.Content>
 *           <Paragraph>This is simple dialog</Paragraph>
 *         </Dialog.Content>
 *       </Dialog>
 *     </Portal>
 *   );
 * };
 *
 * const styles = StyleSheet.create({
 *   title: {
 *     textAlign: 'center',
 *   },
 * })
 *
 * export default MyComponent;
 * ```
 */
const DialogIcon = ({ size = 24, color, icon }: Props) => {
  const theme = useInternalTheme();

  if (!theme.isV3) {
    return null;
  }

  //@ts-ignore
  const iconColor = color || theme.colors.secondary;

  return (
    <View style={styles.wrapper}>
      <Icon source={icon} color={iconColor} size={size} />
    </View>
  );
};

DialogIcon.displayName = 'Dialog.Icon';

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24,
  },
});

export default DialogIcon;

// @component-docs ignore-next-line
export { DialogIcon };
