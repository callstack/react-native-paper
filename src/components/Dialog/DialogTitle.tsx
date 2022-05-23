import * as React from 'react';
import { StyleSheet, StyleProp, TextStyle } from 'react-native';
import Title from '../Typography/v2/Title';
import Text from '../Typography/Text';
import { withTheme } from '../../core/theming';
import type { Theme } from '../../types';

type Props = React.ComponentPropsWithRef<typeof Title> & {
  /**
   * Title text for the `DialogTitle`.
   */
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  /**
   * @optional
   */
  theme: Theme;
};

/**
 * A component to show a title in a Dialog.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="medium" src="screenshots/dialog-title.png" />
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
  const textColor = isV3 ? theme.colors.onSurface : theme.colors?.text;

  return (
    <TextComponent
      variant="headlineSmall"
      // @ts-expect-error We keep old a11y props for backwards compat with old RN versions
      accessibilityTraits="header"
      accessibilityRole="header"
      style={[styles.text, isV3 && styles.v3Text, { color: textColor }, style]}
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

export default withTheme(DialogTitle);

// @component-docs ignore-next-line
export { DialogTitle };
