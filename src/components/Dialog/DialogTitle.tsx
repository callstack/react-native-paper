import * as React from 'react';
import { StyleProp, StyleSheet, TextStyle } from 'react-native';

import { withInternalTheme } from '../../core/theming';
import type { InternalTheme } from '../../types';
import Text from '../Typography/Text';
import Title from '../Typography/v2/Title';

export type Props = React.ComponentPropsWithRef<typeof Title> & {
  /**
   * Title text for the `DialogTitle`.
   */
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  /**
   * @optional
   */
  theme: InternalTheme;
};

/**
 * A component to show a title in a Dialog.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="small" src="screenshots/dialog-title.png" />
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
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
 *         <Dialog.Title>This is a title</Dialog.Title>
 *         <Dialog.Content>
 *           <Paragraph>This is simple dialog</Paragraph>
 *         </Dialog.Content>
 *       </Dialog>
 *     </Portal>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
const DialogTitle = ({ children, theme, style, ...rest }: Props) => {
  const { isV3 } = theme;

  const TextComponent = isV3 ? Text : Title;

  const headerTextStyle = {
    color: isV3 ? theme.colors.onSurface : theme.colors?.text,
    ...(isV3 ? theme.fonts.headlineSmall : {}),
  };

  return (
    <TextComponent
      variant="headlineSmall"
      accessibilityRole="header"
      style={[styles.text, isV3 && styles.v3Text, headerTextStyle, style]}
      {...rest}
    >
      {children}
    </TextComponent>
  );
};

DialogTitle.displayName = 'Dialog.Title';

const styles = StyleSheet.create({
  text: {
    marginTop: 22,
    marginBottom: 18,
    marginHorizontal: 24,
  },
  v3Text: {
    marginTop: 16,
    marginBottom: 16,
  },
});

export default withInternalTheme(DialogTitle);

// @component-docs ignore-next-line
export { DialogTitle };
