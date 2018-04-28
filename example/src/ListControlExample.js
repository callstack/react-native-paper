/* @flow */

import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import {
  ListSection,
  ListControl,
  Divider,
  withTheme,
  Checkbox,
  Switch,
} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import type { Theme } from 'react-native-paper/types';

type Props = {
  theme: Theme,
};

type State = {
  checkbox1: boolean,
  checkbox2: boolean,
  checkbox3: boolean,
  checkbox4: boolean,
  switch1: boolean,
  switch2: boolean,
};

class ListControlExample extends React.Component<Props, State> {
  static title = 'ListControl';

  state = {
    checkbox1: true,
    checkbox2: false,
    checkbox3: true,
    checkbox4: false,
    switch1: true,
    switch2: false,
  };

  render() {
    const {
      theme: {
        colors: { background },
      },
    } = this.props;
    return (
      <ScrollView style={[styles.container, { backgroundColor: background }]}>
        <ListSection title="Checkbox list control">
          <ListControl
            primaryAction={<Checkbox checked={this.state.checkbox1} />}
            title="List control 1"
            secondaryAction={<MaterialIcons name="comment" size={24} />}
            onPress={() => {
              this.setState({ checkbox1: !this.state.checkbox1 });
            }}
          />
          <ListControl
            primaryAction={<Checkbox checked={this.state.checkbox2} />}
            title="List control 2"
            secondaryAction={<MaterialIcons name="comment" size={24} />}
            onPress={() => {
              this.setState({ checkbox2: !this.state.checkbox2 });
            }}
          />
        </ListSection>
        <Divider />
        <ListSection title="Secondary checkbox list control">
          <ListControl
            secondaryAction={<Checkbox checked={this.state.checkbox3} />}
            title="List control 1"
            primaryAction={<MaterialIcons name="comment" size={24} />}
            onPress={() => {
              this.setState({ checkbox3: !this.state.checkbox3 });
            }}
          />
          <ListControl
            secondaryAction={<Checkbox checked={this.state.checkbox4} />}
            title="List control 2"
            primaryAction={<MaterialIcons name="comment" size={24} />}
            onPress={() => {
              this.setState({ checkbox4: !this.state.checkbox4 });
            }}
          />
        </ListSection>
        <Divider />
        <ListSection title="Switch list control">
          <ListControl
            secondaryAction={<Switch value={this.state.switch1} />}
            title="List control 1"
            primaryAction={<MaterialIcons name="comment" size={24} />}
            onPress={() => {
              this.setState({ switch1: !this.state.switch1 });
            }}
          />
          <ListControl
            secondaryAction={<Switch value={this.state.switch2} />}
            title="List control 2"
            primaryAction={<MaterialIcons name="comment" size={24} />}
            onPress={() => {
              this.setState({ switch2: !this.state.switch2 });
            }}
          />
        </ListSection>
        <Divider />
        <ListSection title="Expandable list control">
          <ListControl
            title="List control 1"
            primaryAction={<MaterialIcons name="build" size={24} />}
          >
            <ListControl title="Subitem 1" />
            <ListControl title="Subitem 2" />
          </ListControl>
          <ListControl
            title="List control 2"
            primaryAction={<MaterialIcons name="explore" size={24} />}
          >
            <ListControl title="Subitem 1" />
            <ListControl title="Subitem 2" />
          </ListControl>
        </ListSection>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default withTheme(ListControlExample);
