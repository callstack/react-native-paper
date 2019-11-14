import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, withTheme, RadioButton, Theme } from 'react-native-paper';

type Props = {
  theme: Theme;
};

type State = {
  value: string;
};

class RadioButtonGroupWithItemsExample extends React.Component<Props, State> {
  static title = 'Radio Button Group With Items';

  state = {
    value: 'first',
  };

  render() {
    const {
      theme: {
        colors: { background },
      },
    } = this.props;
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: background,
          },
        ]}
      >
        <RadioButton.Group
          value={this.state.value}
          onValueChange={(value: string) => this.setState({ value })}
        >
          <RadioButton.Item label="First item" value="first" />
          <RadioButton.Item label="Second item" value="second" />
        </RadioButton.Group>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 8,
  },
});

export default withTheme(RadioButtonGroupWithItemsExample);
