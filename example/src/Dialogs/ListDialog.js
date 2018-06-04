/* @flow */

import * as React from 'react';
import { Dialog } from 'react-native-paper';

type Props = {
  visible: boolean,
  close: Function,
};

type State = {
  data: Array<{
    id: string,
    label: string,
    checked: boolean,
  }>,
};

const listData = [
  {
    id: 'First',
    label: 'First option',
    checked: true,
  },
  {
    id: 'Second',
    label: 'Second option',
    checked: false,
  },
  {
    id: 'Third',
    label: 'Third option',
    checked: false,
  },
];

export default class extends React.Component<Props, State> {
  state = {
    data: listData,
  };

  updateState = (id: string) => {
    const data = [...this.state.data].map(item => ({
      ...item,
      checked: item.id === id,
    }));
    this.setState({ data });
  };

  render() {
    return (
      <Dialog.List
        title="ListDialog"
        visible={this.props.visible}
        onDismiss={this.props.close}
        data={this.state.data}
        actions={[
          { text: 'Cancel', onPress: this.props.close, primary: true },
          { text: 'Ok', onPress: this.props.close, primary: true },
        ]}
        onChange={this.updateState}
      />
    );
  }
}
