import { ToggleButton, List, useTheme } from 'react-native-paper';
import * as React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';

type StatusState = 'checked' | 'unchecked';

const ToggleButtonExample = () => {
  const [first, setFirst] = React.useState<string>('bold');
  const [fruit, setFruit] = React.useState<string>('watermelon');
  const [status, setStatus] = React.useState<StatusState>('checked');

  const {
    colors: { background },
  } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <List.Section title="Single">
        <View style={styles.padding}>
          <ToggleButton
            icon="android"
            value="android"
            status={status}
            onPress={(status) =>
              setStatus(status === 'checked' ? 'unchecked' : 'checked')
            }
          />
        </View>
      </List.Section>
      <List.Section title="Group">
        <ToggleButton.Row
          value={first}
          onValueChange={(value: string) => setFirst(value)}
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
            value={fruit}
            onValueChange={(value: string) => setFruit(value)}
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
                icon={fruit === 'watermelon' ? 'heart' : 'heart-outline'}
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
                icon={fruit === 'strawberries' ? 'heart' : 'heart-outline'}
              />
            </ImageBackground>
          </ToggleButton.Group>
        </View>
      </List.Section>
    </View>
  );
};

ToggleButtonExample.title = 'Toggle Button';

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

export default ToggleButtonExample;
