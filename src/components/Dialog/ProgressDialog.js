/* @flow */
import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';
import Paragraph from '../Typography/Paragraph';
import Dialog from './Dialog';
import DialogTitle from './DialogTitle';
import DialogContent from './DialogContent';
import type { DialogProps } from './Dialog';

type Props = DialogProps & {
  /**
   * Size of the ActivityIndicator. It can take following values:
   * - for iOS: 'small' | 'large'
   * - for Android: number
   */
  size: 'small' | 'large' | number,
  /**
   * Color of the ActivityIndicator.
   */
  color?: string,
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
};

/**
 * Progress Dialog shows the user that application is processing something.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Platform } from 'react-native';
 * import { Dialog } from 'react-native-paper';
 *
 * const isIOS = Platform.OS === 'ios';
 *
 * export default class MyComponent extends React.Component {
 *
 *   render() {
 *     return (
 *       <Dialog.Progress
 *         onDismiss={() => {}}
 *         size={isIOS ? 'large' : 48}
 *         text="Loading....."
 *         title="Progress Dialog"
 *       />
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
