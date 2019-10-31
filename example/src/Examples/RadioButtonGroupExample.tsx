import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Colors,
  withTheme,
  RadioButton,
  Paragraph,
  Theme,
} from 'react-native-paper';

type Props = {
  theme: Theme;
};

type State = {
  value: string;
};

class RadioButtonGroupExample extends React.Component<Props, State> {
  static title = 'Radio Button Group';

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
          <RadioButton value="first">
            <Paragraph>First</Paragraph>
          </RadioButton>
          <RadioButton value="second">
            <Paragraph>Second</Paragraph>
          </RadioButton>
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

export default withTheme(RadioButtonGroupExample);
