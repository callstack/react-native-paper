/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Button, withTheme, type Theme } from 'react-native-paper';
import {
  DialogWithCustomColors,
  DialogWithLoadingIndicator,
  DialogWithLongText,
  DialogWithRadioBtns,
  UndismissableDialog,
} from './Dialogs';

type State = {
  visible1: boolean,
  visible2: boolean,
  visible3: boolean,
  visible4: boolean,
  visible5: boolean,
};

type Props = {
  theme: Theme,
};

class DialogExample extends React.Component<Props, State> {
  static title = 'Dialog';

  state = {
    visible1: false,
    visible2: false,
    visible3: false,
    visible4: false,
    visible5: false,
  };

  _openDialog1 = () => this.setState({ visible1: true });
  _openDialog2 = () => this.setState({ visible2: true });
  _openDialog3 = () => this.setState({ visible3: true });
  _openDialog4 = () => this.setState({ visible4: true });
  _openDialog5 = () => this.setState({ visible5: true });

  _closeDialog1 = () => this.setState({ visible1: false });
  _closeDialog2 = () => this.setState({ visible2: false });
  _closeDialog3 = () => this.setState({ visible3: false });
  _closeDialog4 = () => this.setState({ visible4: false });
  _closeDialog5 = () => this.setState({ visible5: false });

  render() {
    const {
      theme: {
        colors: { background },
      },
    } = this.props;
    const { visible1, visible2, visible3, visible4, visible5 } = this.state;
    return (
      <View style={[styles.container, { backgroundColor: background }]}>
        <Button onPress={this._openDialog1}>Show Dialog with long text</Button>
        <Button onPress={this._openDialog2}>
          Show Dialog with radio buttons
        </Button>
        <Button onPress={this._openDialog3}>
          Show Dialog with loading indicator
        </Button>
        <Button onPress={this._openDialog4}>Show undismissable Dialog</Button>
        <Button onPress={this._openDialog5}>
          Show Dialog with custom colors
        </Button>
        <DialogWithLongText visible={visible1} close={this._closeDialog1} />
        <DialogWithRadioBtns visible={visible2} close={this._closeDialog2} />
        <DialogWithLoadingIndicator
          visible={visible3}
          close={this._closeDialog3}
        />
        <UndismissableDialog visible={visible4} close={this._closeDialog4} />
        <DialogWithCustomColors visible={visible5} close={this._closeDialog5} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey200,
    padding: 16,
  },
});

export default withTheme(DialogExample);
