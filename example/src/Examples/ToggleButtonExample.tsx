import * as React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { withTheme, ToggleButton, List, Theme } from 'react-native-paper';

type Props = {
  theme: Theme;
};

type State = {
  first: string;
  second: string;
  fruit: string;
  status: 'checked' | 'unchecked';
};

class ToggleButtonExample extends React.Component<Props, State> {
  static title = 'Toggle Button';

  state: State = {
    first: 'bold',
    second: 'left',
    fruit: 'watermelon',
    status: 'checked',
  };

  render() {
    const {
      theme: {
        colors: { background },
      },
    } = this.props;
    return (
      <View style={[styles.container, { backgroundColor: background }]}>
        <List.Section title="Single">
          <View style={styles.padding}>
            <ToggleButton
              icon="android"
              value="android"
              status={this.state.status}
              onPress={status => {
                this.setState({
                  status: status === 'checked' ? 'unchecked' : 'checked',
                });
              }}
            />
          </View>
        </List.Section>
        <List.Section title="Group">
          <ToggleButton.Row
            value={this.state.first}
            onValueChange={(value: string) =>
              this.setState({
                first: value,
              })
            }
            style={styles.padding}
          >
            <ToggleButton disabled icon="format-italic" value="italic" />
            <ToggleButton icon="format-bold" value="bold" />
            <ToggleButton icon="format-underline" value="underlined" />
            <ToggleButton icon="format-color-text" value="format-color" />
          </ToggleButton.Row>
        </List.Section>
        <List.Section title="Custom">
          <View style={[styles.padding, styles.row]}>
            <ToggleButton.Group
              value={this.state.fruit}
              onValueChange={(value: string) =>
                this.setState({
                  fruit: value,
                })
              }
            >
              <ImageBackground
                style={{
                  width: 143,
                  height: 153,
                  margin: 2,
                }}
                source={{
                  uri:
                    'https://images.pexels.com/photos/1068534/pexels-photo-1068534.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
                }}
              >
                <ToggleButton
                  value="watermelon"
                  size={24}
                  style={{
                    position: 'absolute',
                    right: 0,
                  }}
                  color="white"
                  icon={
                    this.state.fruit === 'watermelon'
                      ? 'heart'
                      : 'heart-outline'
                  }
                />
              </ImageBackground>
              <ImageBackground
                style={{
                  width: 143,
                  height: 153,
                  margin: 2,
                }}
                source={{
                  uri:
                    'https://images.pexels.com/photos/46174/strawberries-berries-fruit-freshness-46174.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
                }}
              >
                <ToggleButton
                  value="strawberries"
                  size={24}
                  style={{
                    position: 'absolute',
                    right: 0,
                  }}
                  color="white"
                  icon={
                    this.state.fruit === 'strawberries'
                      ? 'heart'
                      : 'heart-outline'
                  }
                />
              </ImageBackground>
            </ToggleButton.Group>
          </View>
        </List.Section>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  padding: {
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
  },
});

export default withTheme(ToggleButtonExample);
