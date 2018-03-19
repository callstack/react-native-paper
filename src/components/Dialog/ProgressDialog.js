/* @flow */
import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';
import Paragraph from '../Typography/Paragraph';
import Dialog from './Dialog';
import DialogTitle from './DialogTitle';
import DialogContent from './DialogContent';

type Props = {
  /**
   * Determines whether clicking outside the dialog dismiss it.
   */
  dismissable?: boolean,
  /**
   * Determines whether the dialog is visible.
   */
  visible: boolean,
  /**
   * Callback that is called when the user dismisses the dialog.
   */
  onDismiss: Function,
  /**
   * Size of the ActivityIndicator. It can take following values:
   * - for iOS: 'small' | 'large'
   * - for Android: number
   */
  size: 'small' | 'large' | number,
  /**
   * Color of the ActivityIndicator.
   */
  color: string,
  /**
   * Title of the dialog.
   */
  title: string,
  /**
   * Color of the title.
   */
  titleColor?: string,
  /**
   * Text tha will be displayed next to ActivityIndicator.
   */
  text: string,
  /**
   * Color of the text.
   */
  textColor?: string,
  /**
   * Style that will be applied to whole Dialog e.g. backgroundColor
   */
  style?: any,
};

/**
 * Progress Dialog shows the user that application is processing something.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { View, Platform } from 'react-native';
 * import { ProgressDialog, Colors } from 'react-native-paper';
 *
 * const isIOS = Platform.OS === 'ios';
 *
 * export default class MyComponent extends React.Component {
 *   state = {
 *     visible: false,
 *   };
 *
 *   _showDialog = () => this.setState({ visble: true });
 *   _hideDialog = () => this.setState({ visble: false });
 *
 *   render() {
 *     const { visible } = this.state;
 *     return (
 *       <View>
 *         <Button onPress={this._showDialog}>Show Dialog</Button>
 *         <ProgressDialog
 *           color={Colors.indigo500}
 *           onDismiss={this._hideDialog}
 *           visible={visible}
 *           size={isIOS ? 'large' : 48}
 *           text="Loading....."
 *           title="Progress Dialog"
 *         />
 *       </View>
 *     );
 *   }
 * }
 * ```
 */
class ProgressDialog extends React.Component<Props> {
  static defaultProps = {
    dismissable: true,
    visible: false,
  };

  render() {
    const {
      dismissable,
      onDismiss,
      visible,
      style,
      title,
      titleColor,
      color,
      size,
      textColor,
      text,
    } = this.props;
    return (
      <Dialog
        dismissable={dismissable}
        onDismiss={onDismiss}
        visible={visible}
        style={style}
      >
        <DialogTitle style={{ color: titleColor }}>{title}</DialogTitle>
        <DialogContent>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ActivityIndicator
              color={color}
              size={size}
              style={{ marginRight: 16 }}
            />
            <Paragraph style={{ color: textColor }}>{text}</Paragraph>
          </View>
        </DialogContent>
      </Dialog>
    );
  }
}

export default ProgressDialog;
