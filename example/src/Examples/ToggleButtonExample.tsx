import * as React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';

import { ToggleButton, List } from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

type StatusState = 'checked' | 'unchecked';
type Fruits = 'watermelon' | 'strawberries';

const fonts = {
  noFormat: 'no-format',
  italic: 'italic',
  bold: 'bold',
  underline: 'underlined',
  colorText: 'format-color',
} as const;

type Font = (typeof fonts)[keyof typeof fonts];

const ToggleButtonExample = () => {
  const [first, setFirst] = React.useState('bold');
  const [fruit, setFruit] = React.useState<Fruits>('watermelon');
  const [status, setStatus] = React.useState<StatusState>('checked');
  const [font, setFont] = React.useState<Font>(fonts.noFormat);

  const handleFruit = (value: Fruits) => setFruit(value);

  return (
    <ScreenWrapper>
      <List.Section title="Single">
        <View style={styles.padding}>
          <ToggleButton
            icon="android"
            value="android"
            status={status}
            onPress={() =>
              setStatus(status === 'checked' ? 'unchecked' : 'checked')
            }
          />
        </View>
      </List.Section>
      <List.Section title="Row">
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
      <List.Section title="Group & enums">
        <View style={styles.padding}>
          <ToggleButton.Group value={font} onValueChange={setFont}>
            <ToggleButton disabled icon="format-italic" value={fonts.italic} />
            <ToggleButton icon="format-bold" value={fonts.bold} />
            <ToggleButton icon="format-underline" value={fonts.underline} />
            <ToggleButton icon="format-color-text" value={fonts.colorText} />
          </ToggleButton.Group>
        </View>
      </List.Section>
      <List.Section title="Custom & union types">
        <View style={[styles.padding, styles.row]}>
          <ToggleButton.Group value={fruit} onValueChange={handleFruit}>
            <ImageBackground
              style={styles.customImage}
              source={{
                uri: 'https://images.pexels.com/photos/5946081/pexels-photo-5946081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
              }}
            >
              <ToggleButton
                value="watermelon"
                size={24}
                style={styles.customButton}
                iconColor="white"
                icon={fruit === 'watermelon' ? 'heart' : 'heart-outline'}
              />
            </ImageBackground>
            <ImageBackground
              style={styles.customImage}
              source={{
                uri: 'https://images.pexels.com/photos/46174/strawberries-berries-fruit-freshness-46174.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
              }}
            >
              <ToggleButton
                value="strawberries"
                size={24}
                style={styles.customButton}
                iconColor="white"
                icon={fruit === 'strawberries' ? 'heart' : 'heart-outline'}
              />
            </ImageBackground>
          </ToggleButton.Group>
        </View>
      </List.Section>
    </ScreenWrapper>
  );
};

ToggleButtonExample.title = 'Toggle Button';

const styles = StyleSheet.create({
  padding: {
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
  },
  customImage: {
    width: 143,
    height: 153,
    margin: 2,
  },
  customButton: {
    position: 'absolute',
    right: 0,
  },
});

export default ToggleButtonExample;
