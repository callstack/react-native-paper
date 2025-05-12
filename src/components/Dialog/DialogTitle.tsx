import * as React from 'react';
import { StyleProp, StyleSheet, TextStyle } from 'react-native';

import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';
import Text from '../Typography/Text';

export type Props = React.ComponentPropsWithRef<typeof Text> & {
  /**
   * Title text for the `DialogTitle`.
   */
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  /**
   * @optional
   */
  theme?: ThemeProp;
};

/**
 * A component to show a title in a Dialog.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Dialog, Portal, Text } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [visible, setVisible] = React.useState(false);
 *
 *   const hideDialog = () => setVisible(false);
 *
 *   return (
 *     <Portal>
 *       <Dialog visible={visible} onDismiss={hideDialog}>
 *         <Dialog.Title>This is a title</Dialog.Title>
 *         <Dialog.Content>
 *           <Text variant="bodyMedium">This is simple dialog</Text>
 *         </Dialog.Content>
 *       </Dialog>
 *     </Portal>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
const DialogTitle = ({
  children,
  theme: themeOverrides,
  style,
  ...rest
}: Props) => {
  const { colors, fonts } = useInternalTheme(themeOverrides);

  const headerTextStyle = {
    color: colors.onSurface,
    ...fonts.headlineSmall,
  };

  return (
    <Text
      variant="headlineSmall"
      accessibilityRole="header"
      style={[styles.text, headerTextStyle, style]}
      {...rest}
    >
      {children}
    </Text>
  );
};

DialogTitle.displayName = 'Dialog.Title';

const styles = StyleSheet.create({
  text: {
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 16,
  },
});

export default DialogTitle;

// @component-docs ignore-next-line
export { DialogTitle };
