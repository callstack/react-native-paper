/* @flow */
import * as React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

import Dialog from './Dialog';
import DialogTitle from './DialogTitle';
import DialogActions from './DialogActions';
import DialogScrollArea from './DialogScrollArea';
import RadioButton from '../RadioButton';
import Checkbox from '../Checkbox';
import TouchableRipple from '../TouchableRipple';
import Subheading from '../Typography/Subheading';
import Button from '../Button';

type Props = {
  /**
   * Determines whether clicking outside the dialog dismiss it.
   */
  dismissable?: boolean,
  /**
   * Callback that is called when the user dismisses the dialog.
   */
  onDismiss: Function,
  /**
   * Determines Whether the dialog is visible.
   */
  visible: boolean,
  /**
   * Dialog's title displayed on top.
   */
  title: string,
  /**
   * data prop is an array of objects that determines the structure of the list.
   * Every object should contain following properties:
   *
   * - `id`: a string representing id of list item.
   * - `label`: a string that will be displayed as list item.
   * - `checked`: a boolean that determines if item is checked or not.
   *
   * Example:
   *
   * ```js
   * [
   *   { id: 'first', label: 'First option', checked: true },
   *   { id: 'second', label: 'Second option', checked: false },
   *   { id: 'third', label: 'Third option', checked: false },
   * ]
   * ```
   *
   * `ListDialog` is controlled component, which means checked `property` needs to be updated via the `onChange` callback.
   */
  data: Array<{
    id: string,
    label: string,
    checked: boolean,
  }>,
  /**
   * Function that is called on selection change. It takes 2 following parameters:
   * - `id`: a string that represents id of changed item.
   * - `value`: a boolean that represents if RadioButton or Checkbox is checked.
   */
  onChange: (id: string, value: boolean) => mixed,
  /**
   * Array of objects that are transformed on Buttons. Objects should have following properties:
   *
   * - `text`: a string that will be displayed inside button.
   * - `onPress`: a function that will be invoked on button press.
   * - Any other prop that react-native-paper's Button takes.
   *
   * Example:
   *
   * ```js
   * [
   *   { text: 'Cancel', onPress: () => console.log('pressed') },
   *   { text: 'Ok', onPress: () => console.log('pressed'), primary: true },
   * ]
   * ```
   */
  actions: Array<{
    text: string,
    onPress: Function,
  }>,
  /**
   * Max height of the content section. When content is higher it's going to be scrollable.
   */
  maxHeight?: number,
  /**
   * Color that will be applied to Checkbox or RadioButton.
   */
  color?: string,
  /**
   * Determines if only one element can be checked or more at the same time.
   * Dialog will use internally Checkbox if multiselect is true and RadioButton if false.
   */
  multiselect: boolean,
  style?: any,
};

/**
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Dialog } from 'react-native-paper';
 *
 * const listData = [
 *   {
 *     id: 'First',
 *     label: 'First option',
 *     checked: true,
 *   },
 *   {
 *     id: 'Second',
 *     label: 'Second option',
 *     checked: false,
 *   },
 * ];
 *
 * export default class extends React.Component {
 *   state = {
 *     data: listData,
 *   };
 *
 *   updateState = id => {
 *     const data = [...this.state.data].map(item => ({
 *       ...item,
 *       checked: item.id === id,
 *     }));
 *     this.setState({ data });
 *   };
 *
 *   render() {
 *     return (
 *       <Dialog.ListDialog
 *         title="ListDialog"
 *         visible={this.props.visible}
 *         onDismiss={this.props.close}
 *         data={this.state.data}
 *         actions={[
 *           { text: 'Ok', onPress: this.props.close, primary: true },
 *         ]}
 *         onChange={this.updateState}
 *       />
 *     );
 *   }
 * }
 * ```
 */

class ListDialog extends React.Component<Props> {
  static defaultProps = {
    dismissable: true,
    visible: false,
    multiselect: false,
  };

  static displayName = 'Dialog.List';

  render() {
    const {
      title,
      onDismiss,
      dismissable,
      visible,
      actions,
      maxHeight,
      multiselect,
      data,
      onChange,
      color,
      style,
    } = this.props;
    return (
      <Dialog
        onDismiss={onDismiss}
        visible={visible}
        style={style}
        dismissable={dismissable}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogScrollArea
          style={[styles.scrollArea, { maxHeight: maxHeight || 200 }]}
        >
          <ScrollView>
            <View>
              {data.map(({ label, id, checked }) => (
                <TouchableRipple
                  key={id}
                  onPress={() => onChange(id, !checked)}
                >
                  <View style={styles.row}>
                    <View pointerEvents="none">
                      {multiselect ? (
                        <Checkbox value={id} checked={checked} color={color} />
                      ) : (
                        <RadioButton
                          value={id}
                          checked={checked}
                          color={color}
                        />
                      )}
                    </View>
                    <Subheading style={styles.text}>{label}</Subheading>
                  </View>
                </TouchableRipple>
              ))}
            </View>
          </ScrollView>
        </DialogScrollArea>
        <DialogActions>
          {actions.map(({ text, onPress, ...rest }) => (
            <Button {...rest} key={text} onPress={onPress}>
              {text}
            </Button>
          ))}
        </DialogActions>
      </Dialog>
    );
  }
}

const styles = StyleSheet.create({
  scrollArea: {
    paddingHorizontal: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  text: {
    paddingLeft: 8,
  },
});

export default ListDialog;
