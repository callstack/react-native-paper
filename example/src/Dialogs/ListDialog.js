/* @flow */

import * as React from 'react';
import { ListDialog } from 'react-native-paper';

type Props = {
  visible: boolean,
  close: Function,
};

const sampleData = [
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

type State = {
  data: Array<{
    id: string,
    label: string,
    checked: boolean,
  }>,
};

export default class extends React.Component<Props, State> {
  state = {
    data: sampleData,
  };

  updateState = (id: string, value?: boolean) => {
    const data = [...this.state.data].map(item => {
      if (item.id === id) {
        return {
          ...item,
          checked: value,
        };
      }
      return {
        ...item,
      };
    });
    this.setState({ data });
  };

  render() {
    return (
      <ListDialog
        title="ListDialog"
        visible={this.props.visible}
        onDismiss={this.props.close}
        data={this.state.data}
        actions={[
          { text: 'Cancel', callback: this.props.close },
          { text: 'Ok', callback: this.props.close, primary: true },
        ]}
        multiselect
        onChange={this.updateState}
      />
    );
  }
}
