import * as React from 'react';
import { StyleSheet, StyleProp, TextStyle } from 'react-native';
import Title from '../Typography/Title';
import { withTheme } from '../../core/theming';
import { Theme } from '../../types';

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
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Paragraph, Dialog, Portal } from 'react-native-paper';
 *
 * export default class MyComponent extends React.Component {
 *   state = {
 *     visible: false,
 *   };
 *
 *   _hideDialog = () => this.setState({ visible: false });
 *
 *   render() {
 *     return (
 *       <Portal>
 *         <Dialog
 *           visible={this.state.visible}
 *           onDismiss={this._hideDialog}>
 *           <Dialog.Title>This is a title</Dialog.Title>
 *           <Dialog.Content>
 *             <Paragraph>This is simple dialog</Paragraph>
 *           </Dialog.Content>
 *         </Dialog>
 *       </Portal>
 *     );
 *   }
 * }
 * ```
 */
class DialogTitle extends React.Component<Props> {
  static displayName = 'Dialog.Title';

  render() {
    const { children, theme, style, ...rest } = this.props;

    return (
      <Title
        accessibilityTraits="header"
        accessibilityRole="header"
        style={[styles.text, { color: theme.colors.text }, style]}
        {...rest}
      >
        {children}
      </Title>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    marginTop: 22,
    marginBottom: 18,
    marginHorizontal: 24,
  },
});

export default withTheme(DialogTitle);

// @component-docs ignore-next-line
export { DialogTitle };
