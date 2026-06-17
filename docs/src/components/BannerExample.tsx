import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Avatar,
  Button,
  DarkTheme,
  FAB,
  LightTheme,
  ProgressBar,
  Provider,
  RadioButton,
  Switch,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';

import BrowserOnly from '../rspress-compat/BrowserOnly';
import { useColorMode } from '../rspress-compat/theme-common';

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderWidth: 1,
    borderRadius: 16,
    marginTop: 16,
    marginBottom: 32,
    overflow: 'hidden',
  },
  row: {
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
});

const Stack: React.FC<
  React.PropsWithChildren<{
    direction?: 'row' | 'column';
    spacing?: number;
    style?: any;
  }>
> = ({ direction = 'column', spacing = 0, style, children }) => {
  return (
    <View style={[{ flexDirection: direction, margin: -spacing }, style]}>
      {React.Children.map(children, (child, index) => (
        <View key={index} style={{ flexDirection: direction, margin: spacing }}>
          {child}
        </View>
      ))}
    </View>
  );
};

const BannerExample = () => {
  const theme = useTheme();

  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const [text, setText] = React.useState('');
  const [checked, setChecked] = React.useState('first');

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.surfaceVariant,
        },
      ]}
    >
      <Stack spacing={16}>
        <Stack direction="row" spacing={8} style={styles.row}>
          <Button loading onPress={() => {}}>
            Loading
          </Button>
          <Button mode="contained-tonal" icon="camera" onPress={() => {}}>
            Icon
          </Button>
          <Button icon="camera" mode="contained" onPress={() => {}}>
            Press me
          </Button>
          <FAB icon="plus" size="default" onPress={() => {}} />
          <FAB icon="plus" size="medium" onPress={() => {}} />
          <FAB icon="plus" size="large" onPress={() => {}} />
          <Avatar.Text label="MD" />
          <Avatar.Icon icon="folder" />
        </Stack>
        <ProgressBar indeterminate />
        <Stack spacing={8}>
          <Text variant="displayLarge">Display Large</Text>
          <Text variant="displayMedium">Display Medium</Text>
          <Text>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Est
            tenetur neque laudantium, repellendus at excepturi quasi qui culpa.
            Incidunt nesciunt unde perspiciatis atque rerum blanditiis sint
            ratione, sequi totam temporibus.
          </Text>
        </Stack>
        <Stack direction="row" spacing={8}>
          <Switch value={!isSwitchOn} onValueChange={onToggleSwitch} />
          <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
        </Stack>

        <Stack direction="row" spacing={8} style={styles.row}>
          <TextInput
            label="Email"
            value={text}
            onChangeText={(value) => setText(value)}
          />
          <TextInput
            label="Email"
            variant="outlined"
            value={text}
            onChangeText={(value) => setText(value)}
          />
        </Stack>

        <Stack direction="row" spacing={8}>
          <RadioButton
            value="first"
            status={checked === 'first' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('first')}
          />
          <RadioButton
            value="second"
            status={checked === 'second' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('second')}
          />
          <RadioButton
            value="third"
            status={checked === 'third' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('third')}
          />
        </Stack>
      </Stack>
    </View>
  );
};

const Shimmer = () => {
  return (
    <View
      style={{
        display: 'flex',
        minHeight: 500,
        borderWidth: 1,
        borderColor: 'rgba(125, 82, 96, 0.4)',
        borderStyle: 'solid',
        borderRadius: 16,
        alignContent: 'center',
        justifyContent: 'center',
        padding: 30,
        marginTop: 36,
        marginBottom: 32,
      }}
    />
  );
};

const ThemedBannerExample = () => {
  const isDarkTheme = useColorMode().colorMode === 'dark';

  return (
    <Provider theme={isDarkTheme ? DarkTheme : LightTheme}>
      <BannerExample />
    </Provider>
  );
};

export default function ClientSideBannerExample() {
  return (
    <BrowserOnly fallback={<Shimmer />}>
      {() => <ThemedBannerExample />}
    </BrowserOnly>
  );
}
